var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  default: () => Routes,
  load: () => load
});
var import_index_08869495 = __toModule(require("../../chunks/index-08869495.js"));
var import_load_user_data_ba355a80 = __toModule(require("../../chunks/load_user_data-ba355a80.js"));
var Ably = __toModule(require("ably"));
const browser = false;
const subscriber_queue = [];
function writable(value, start = import_index_08869495.n) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if ((0, import_index_08869495.a)(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run, invalidate = import_index_08869495.n) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || import_index_08869495.n;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
async function load({ session }) {
  return (0, import_load_user_data_ba355a80.l)(session, "/index.svelte");
}
const Routes = (0, import_index_08869495.c)(($$result, $$props, $$bindings, slots) => {
  let $remote_id, $$unsubscribe_remote_id;
  const remote_id = writable("");
  $$unsubscribe_remote_id = (0, import_index_08869495.b)(remote_id, (value) => $remote_id = value);
  var local_id;
  var local_video_element;
  var remote_video_element;
  let { user } = $$props;
  let { ably_token } = $$props;
  var ably;
  if ($$props.remote_id === void 0 && $$bindings.remote_id && remote_id !== void 0)
    $$bindings.remote_id(remote_id);
  if ($$props.user === void 0 && $$bindings.user && user !== void 0)
    $$bindings.user(user);
  if ($$props.ably_token === void 0 && $$bindings.ably_token && ably_token !== void 0)
    $$bindings.ably_token(ably_token);
  {
    {
      if (ably_token && browser) {
        console.log("can listen to ably channel now!");
        let clientOptions = {
          token: ably_token,
          authUrl: `${window.location.origin}/ably_auth`,
          ttl: 36e5
        };
        ably = new Ably.Realtime.Promise(clientOptions);
        ably.connection.on("connected", function() {
          console.log("Connected to Ably");
        });
        ably.connection.on("failed", function(err) {
          console.log("Failed to connect to Ably", err);
        });
        ably.connection.on("disconnected", function() {
          console.log("Disconnected from Ably");
        });
        ably.connection.on("suspended", function() {
          console.log("Suspended from Ably");
        });
        ably.connection.on("closed", function() {
          console.log("Closed from Ably");
        });
        ably.channels.get("user_list").subscribe(function(msg) {
          console.log("Received message: " + msg);
        });
      }
    }
  }
  $$unsubscribe_remote_id();
  return `${!user ? `<section class="${"hero is-small is-info"}"><div class="${"hero-body"}"><p class="${"title"}">Welcome!</p>
			<p class="${"subtitle"}">This is an audio/video chatting site to help you find kindred spirits.</p></div></section>
	<section class="${"section"}"><h1 class="${"title"}">How&#39;s it work?</h1>

		<div class="${"columns is-desktop"}"><div class="${"column"}"><article class="${"message is-info"}"><div class="${"message-header"}"><p>1. Sign up <span class="${"icon"}"><i class="${"fas fa-user-plus"}"></i></span></p></div>
					<div class="${"message-body"}">You can signup using your pre-existing accounts on:<br>
						<div class="${"content p-2 m-2"}"><div class="${"tags"}"><span class="${"tag is-dark"}">Github <span class="${"icon"}"><i class="${"fab fa-github"}"></i></span></span>
								<span class="${"tag is-dark"}">Linkedin <span class="${"icon"}"><i class="${"fab fa-linkedin"}"></i></span></span>
								<span class="${"tag is-dark"}">Discord <span class="${"icon"}"><i class="${"fab fa-discord"}"></i></span></span>
								<span class="${"tag is-dark"}">Google <span class="${"icon"}"><i class="${"fab fa-google"}"></i></span></span></div></div>
						Alternatively, you can sign up using a standard email<span class="${"icon"}"><i class="${"fas fa-envelope"}"></i></span>
						and password <span class="${"icon"}"><i class="${"fas fa-key"}"></i></span>.
					</div></article></div>
			<div class="${"column"}"><article class="${"message is-success"}"><div class="${"message-header"}"><p>2. Interact <span class="${"icon"}"><i class="${"fas fa-comments"}"></i></span></p></div>
					<div class="${"message-body"}">We use learning algorithms to match you with the most suitable available user. Based on
						your interaction, you can either <strong>like</strong> or <strong>dislike</strong> the user.
						These ratings will inform the algorithm to match you in the future.
					</div></article></div>
			<div class="${"column"}"><article class="${"message is-warning"}"><div class="${"message-header"}"><p>3. Bad interactions <span class="${"icon"}"><i class="${"fas fa-exclamation-triangle"}"></i></span></p></div>
					<div class="${"message-body"}">If you encounter a bad interaction, you can report it. This is not like other reporting
						processes.

						<strong>Reporting an interaction will kick off a remediation process. </strong>
						<br>
						<br>
						This process consists of the following steps:
						<br>
						<div class="${"content"}"><ol><li>Both members will be notified of the bad interaction. Both accounts are
									temporarily blocked from interacting with others until they either resolve the
									issue or agree to the remediation process.
								</li>
								<li>The video of the interaction will be reviewed by 3 community members and see if
									the interaction conforms to the rules of the server at the time of interaction.
								</li>
								<li>If the reported bad interaction does not conform to the global and server rules, a
									redemption will be required by the offender to resolve the issue. Each server must
									define its own redemption process.
								</li></ol></div></div></article></div></div></section>` : ``}

${user ? `<section class="${"hero is-small is-success"}"><div class="${"hero-body"}"><p class="${"title"}">Welcome back!</p></div></section>
	${``}

	<section class="${"section"}"><div class="${"columns"}"><div class="${"column"}"><div class="${"box"}"><div class="${"content"}"><p class="${"title"}">Your Video</p>

						<video class="${"column is-full is-dark"}"${(0, import_index_08869495.d)("this", local_video_element, 0)}><track kind="${"captions"}"></video>
						<div class="${"field"}"><div class="${"control"}"><label class="${"label"}">Peer id
									<input class="${"input"}" type="${"text"}"${(0, import_index_08869495.d)("value", local_id, 0)} readonly></label></div>

							<small>(Send this peer id to your chatting partner. It is your identifier.)</small></div></div></div></div>
			<div class="${"column"}"><div class="${"box"}"><div class="${"content"}"><p class="${"title"}">Remote Video</p>

						<video class="${"column is-full is-dark"}"${(0, import_index_08869495.d)("this", remote_video_element, 0)}><track kind="${"captions"}"></video>
						<div class="${"field"}"><div class="${"control"}"><label class="${"label"}">Remote ID
									<input class="${"input"}" type="${"text"}"${(0, import_index_08869495.d)("value", $remote_id, 0)} readonly></label></div></div></div></div></div></div></section>
	<section class="${"section"}"><div class="${"card"}"><div class="${"card-content"}"><div class="${"content"}">
					<div class="${"field"}"><div class="${"control"}"><label class="${"label"}">Call Remote ID
								<input class="${"input"}" type="${"text"}" placeholder="${"Remote ID"}"${(0, import_index_08869495.d)("value", $remote_id, 0)}></label></div></div></div></div></div></section>` : ``}`;
});
