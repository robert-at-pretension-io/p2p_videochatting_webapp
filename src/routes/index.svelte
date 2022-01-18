<script context="module">
	import { load_user_data } from '$lib/load_user_data';
	export async function load({ session }) {
		return load_user_data(session, '/index.svelte');
	}
</script>

<script>
	import { browser } from '$app/env';
	import { createEventDispatcher, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	export const remote_id = writable('');
  import * as Ably from "ably";

	var local_id;
	var local_video_element;
	var local_stream;
	var Peer;
	var remote_video_element;
	var remote_stream;
	var error;

	if (browser) {
		onMount(async () => {
			// Get local stream, show it in the local video element and add it to be sent
			async function getMedia(constraints) {
				try {
					local_stream = await navigator.mediaDevices.getUserMedia(constraints);
					local_video_element.srcObject = local_stream;
					local_video_element.play();
					return local_stream;
				} catch (err) {
					error = err;
				}
			}

			local_stream = await getMedia({ video: true, audio: true });

			// This function is called when the user clicks the call button

			if (local_id) {
				return;
			} else {
				window.parcelRequire = null;
				Peer = await (await import('peerjs')).default;
				let peer = new Peer();
				// handle peer connection to PeerServer
				peer.on('open', function (id) {
					local_id = id;
					console.log('My peer ID is: ' + id);
				});
				// handle incoming connections from others
				peer.on('connection', function (conn) {
					conn.on('data', function (data) {
						console.log(data);
					});
				});
				// media calls to others
				peer.on('call', async function (call) {
					call.answer(local_stream); // Answer the call with an A/V stream.
					call.on('stream', async function (remoteStream) {
						remote_video_element.srcObject = remoteStream;

						await remote_video_element.play();
						remote_stream = remoteStream;
					});
				});
				remote_id.subscribe(async (id) => {
					console.log('remote id', id.toString());
					if (id.toString().length == 36) {
						console.log('Attempting to call ' + id);
						await call(id);
					}
				});

				async function call(peer_id) {
					if (local_stream) {
						var call = peer.call(peer_id, local_stream);
						call.on('stream', async function (remoteStream) {
							remote_video_element.srcObject = remoteStream;

							await remote_video_element.play();
							remote_stream = remoteStream;
						});
					} else {
						error =
							'You can only call when you have a local stream. Make sure your webcam is enabled.';
						return;
					}
				}
			}
		});
	}

	export let user;
	export let ably_token;
 var ably;
  $: {
    
    if (ably_token && browser) {
      console.log("can listen to ably channel now!");
      let clientOptions = {
          token: ably_token,
          authUrl: `${window.location.origin}/ably_auth`,
          ttl: 3600000,
      };
      ably = new Ably.Realtime.Promise(clientOptions);


      ably.connection.on('connected', function () {
          console.log('Connected to Ably');
      });

      ably.connection.on('failed', function (err) {
          console.log('Failed to connect to Ably', err);
      });

      ably.connection.on('disconnected', function () {
          console.log('Disconnected from Ably');
      });

      ably.connection.on('suspended', function () {
          console.log('Suspended from Ably');
      });


      ably.connection.on('closed', function () {
          console.log('Closed from Ably');
      });

      ably.channels.get('user_list').subscribe( function (msg) {
          console.log('Received message: ' + msg);
      });
    }
  }

//   async function connect() {

// // This channel is used for getting requests for video chats
// let channel = ably.channels.get(user.email);
// channel.subscribe((message) => {
// console.log(`message received:, ${message.name} , ${message.data}`);
// remote_id.set(message.data.remote_id);
// });

// let user_list_channel = await ably.channels.get('user_list');

// user_list_channel.subscribe((message) => {
//   console.log(`message received:, ${message.name} , ${message.data}`);
// });
// }

//   if (ably) {
//     await connect();
//   }
    
  

</script>

{#if !user}
	<section class="hero is-small is-info">
		<div class="hero-body">
			<p class="title">Welcome!</p>
			<p class="subtitle">This is an audio/video chatting site to help you find kindred spirits.</p>
		</div>
	</section>
	<section class="section">
		<h1 class="title">How's it work?</h1>

		<div class="columns is-desktop">
			<div class="column">
				<article class="message is-info">
					<div class="message-header">
						<p>1. Sign up <span class="icon"><i class="fas fa-user-plus" /></span></p>
					</div>
					<div class="message-body">
						You can signup using your pre-existing accounts on:<br />
						<div class="content p-2 m-2">
							<div class="tags">
								<span class="tag is-dark">
									Github <span class="icon"> <i class="fab fa-github" /></span>
								</span>
								<span class="tag is-dark">
									Linkedin <span class="icon"><i class="fab fa-linkedin" /></span>
								</span>
								<span class="tag is-dark">
									Discord <span class="icon"><i class="fab fa-discord" /></span>
								</span>
								<span class="tag is-dark">
									Google <span class="icon"><i class="fab fa-google" /></span>
								</span>
							</div>
						</div>
						Alternatively, you can sign up using a standard email<span class="icon"
							><i class="fas fa-envelope" /></span
						>
						and password <span class="icon"><i class="fas fa-key" /></span>.
					</div>
				</article>
			</div>
			<div class="column">
				<article class="message is-success">
					<div class="message-header">
						<p>2. Interact <span class="icon"><i class="fas fa-comments" /></span></p>
					</div>
					<div class="message-body">
						We use learning algorithms to match you with the most suitable available user. Based on
						your interaction, you can either <strong>like</strong> or <strong>dislike</strong> the user.
						These ratings will inform the algorithm to match you in the future.
					</div>
				</article>
			</div>
			<div class="column">
				<article class="message is-warning">
					<div class="message-header">
						<p>
							3. Bad interactions <span class="icon"><i class="fas fa-exclamation-triangle" /></span
							>
						</p>
					</div>
					<div class="message-body">
						If you encounter a bad interaction, you can report it. This is not like other reporting
						processes.

						<strong> Reporting an interaction will kick off a remediation process. </strong>
						<br />
						<br />
						This process consists of the following steps:
						<br />
						<div class="content">
							<ol>
								<li>
									Both members will be notified of the bad interaction. Both accounts are
									temporarily blocked from interacting with others until they either resolve the
									issue or agree to the remediation process.
								</li>
								<li>
									The video of the interaction will be reviewed by 3 community members and see if
									the interaction conforms to the rules of the server at the time of interaction.
								</li>
								<li>
									If the reported bad interaction does not conform to the global and server rules, a
									redemption will be required by the offender to resolve the issue. Each server must
									define its own redemption process.
								</li>
							</ol>
						</div>
					</div>
				</article>
			</div>
		</div>
	</section>
{/if}

{#if user}
	<section class="hero is-small is-success">
		<div class="hero-body">
			<p class="title">Welcome back!</p>
		</div>
	</section>
	{#if error}
		<section>
			<article class="message is-danger">
				<div class="message-header">
					<p>Error</p>
				</div>
				<div class="message-body">
					{error}
				</div>
			</article>
		</section>
	{/if}

	<section class="section">
		<div class="columns">
			<div class="column">
				<div class="box">
					<div class="content">
						<p class="title">Your Video</p>

						<video bind:this={local_video_element} playsInline autoplay muted class="column is-full is-dark">
							<track kind="captions" />
						</video>
						<div class="field">
							<div class="control">
								<label class="label"
									>Peer id
									<input class="input" type="text" value={local_id} readonly />
								</label>
							</div>

							<small>(Send this peer id to your chatting partner. It is your identifier.)</small>
						</div>
					</div>
				</div>
			</div>
			<div class="column">
				<div class="box">
					<div class="content">
						<p class="title">Remote Video</p>

						<video bind:this={remote_video_element} playsInline autoplay class="column is-full is-dark">
							<track kind="captions" />
						</video>
						<div class="field">
							<div class="control">
								<label class="label"
									>Remote ID
									<input class="input" type="text" value={$remote_id} readonly />
								</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<section class="section">
		<div class="card">
			<div class="card-content">
				<div class="content">
					<!-- This will be an input collecting the remote_id that calls a local function when the call button is pressed -->
					<div class="field">
						<div class="control">
							<label class="label"
								>Call Remote ID
								<input class="input" type="text" placeholder="Remote ID" bind:value={$remote_id} />
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}
