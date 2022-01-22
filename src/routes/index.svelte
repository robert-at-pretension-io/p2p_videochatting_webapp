<script context="module">
	import { load_user_data } from '$lib/load_user_data';
	export async function load({ session }) {
		return load_user_data(session, '/index.svelte');
	}
</script>

<script>
	import { browser } from '$app/env';
	import { writable } from 'svelte/store';
	import {onMount} from 'svelte';
  import * as Ably from "ably";

	var local_id;
	var local_video_element;
	var local_stream;
	var Peer;
	var remote_video_element;
	var remote_stream;
	var error;
	var call_initiating = false;
	let remote_id = writable('');
	let user_list = writable([]);

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
					console.log(`getting call from ${call.peer}`);
					call_initiating = true;
					call.answer(local_stream); // Answer the call with an A/V stream.
					call.on('stream', async function (remoteStream) {
						remote_video_element.srcObject = remoteStream;

						await remote_video_element.play();
						remote_stream = remoteStream;
					});
				});
				remote_id.subscribe(async (id) => {
					if (id.toString().length == 36) {

						console.log('Attempting to call ' + id);
						await call(id);
					}
				});

				async function call(peer_id) {
					call_initiating = true;
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
 var attempts = 0;
 var ably_connected = false;
  $: {
    
    if (ably_token && browser && user && local_id && !ably_connected) {
    //   console.log("can listen to ably channel now!");
      let clientOptions = {
          token: ably_token,
          authUrl: `${window.location.origin}/ably_auth`,
          ttl: 3600000,
      };
      ably = new Ably.Realtime.Promise(clientOptions);


      ably.connection.on('connected', function () {
          console.log('Connected to Ably');
		  let user_list = ably.channels.get('user_list');
		  user_list.publish({name: "new user", data: {user: user, id: local_id}});
		  ably_connected = true;
	  
      });

      ably.connection.on('failed', async function (err) {
          console.log('Failed to connect to Ably', err);
		  if (attempts < 5){
		  let token = await fetch('/ably_auth', {
			method: 'GET',
		  });
		  let token_data = await token.json();
		  console.log(`current attempt ${attempts}, token data: ${JSON.stringify(token_data, null, 2)}`);
		  ably_token = token_data;
		  attempts += 1;
		}
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
		  if (msg.data.user && msg.data.id) {
			if (user.email != msg.data.user.email) {
				user_list.update(function (list) {
					return [...list, msg.data];
				});
				console.log(`user list: ${JSON.stringify($user_list, null, 2)}`);
		  }
		}
      });

	  ably.channels.get(`direct_message:${user.email}`).subscribe( function (msg) {
          console.log('Received direct message: ' + msg);
      });
    }
  }


    
  

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

						<strong> Reporting an interaction will kick off a remediation process involving both parties and community moderators. </strong>
						
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
	{#if $user_list.length > 0}
	<section class="section">
		<div class="container ">
				<table class="table is-hoverable">
					<thead>
						<tr>
							<th>User</th>
							<th>Click to Videochat</th>
						</tr>
					</thead>
					{#each $user_list as user}
					<tr>
						<td>{user.user.email}</td>
						<td><button	class="button" on:click={() => {remote_id.set(user.id); }}> Click to Videochat 
						</button>	
						</td>
					</tr>
					{/each}
				</table>
		</div>

	</section>
	{/if}

	<section class="section">
		<div class="columns">
			<div class="column is-half">
				<div class="box">
					<div class="content">


						<video bind:this={local_video_element} autoplay loop muted defaultMuted playsinline preload=true controls class="column is-full is-dark">
							<track kind="captions" />
						</video>

					</div>
				</div>
			</div>
			{#if call_initiating}
			<div class="column is-half">
				<div class="box">
					<div class="content">


						<video bind:this={remote_video_element} autoplay loop muted defaultMuted controls playsinline preload=true class="column is-full is-dark">
							<track kind="captions" />
						</video>

					</div>
				</div>
			</div>
			{/if}
		</div>
	</section>

{/if}
