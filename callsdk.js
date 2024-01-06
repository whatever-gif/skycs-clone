


function updateUI() { }

const eventHandlers = {
  // 'addstream': function (e) {
  //   console.log('addstream', e);
  // },
  // 'progress': function (e) {
  //   console.log('call is in progress');
  // },
  // 'failed': function (e) {
  //   console.log('call failed with cause: ', e);
  // },
  // 'ended': function (e) {
  //   console.log('call ended with cause: ' + e);
  // },

  // 'confirmed': function (e) {
  //   console.log('call confirmed');
  // },

  // 'canceled': function (e) {
  //   console.log('call canceled');
  // }


}
const _SipPhone = {
  data: null,
  phone: null,
  //incomingCallAudio: null,
  phoneStatus: {
    isOnline: false,
  },

  session: null,


  callOptions: {
    eventHandlers: eventHandlers,

    mediaConstraints: { audio: true, video: false }
  },

  callNotify: () => {


    var doNotify = function (msg) {
      var icon = '/images/icons/logo.png';
      var title = 'Skycs';
      var msg = 'Cuộc gọi đến';

      var audio = document.getElementById('audio_ring');


      if (!audio) {
        audio = document.createElement('span');
        audio.setAttribute('id', 'audio_ring');

        document.body.appendChild(audio);

      }

      audio.innerHTML = '<audio autoplay loop><source src="/audio/ringing.mp3"></audio>';

      var n = new Notification("Skycs", { body: "Cuộc gọi đến", icon: '/images/icons/logo.png' });

      n.onclick = function (x) {
        window.focus(); this.close();


      };
    }

    if (!("Notification" in window)) {
      return alert("This browser does not support Desktop notifications");
    }
    if (Notification.permission === "granted") {
      return doNotify();
    }
    if (Notification.permission !== "denied") {
      Notification.requestPermission((permission) => {
        if (permission === "granted") {


          return doNotify();
        }
      });
      return;
    }

  },

  stopRinging: () => {
    var audio = document.getElementById('audio_ring');
    if (audio) audio.innerHTML = '';
  },

  init: function (data, funcOk, funcFailed) {
    this.data = data;
    //var socket = new JsSIP.WebSocketInterface('wss://192.168.0.20:4443'); // FILL WSS SERVER
    var socket = new JsSIP.WebSocketInterface(`${data.Protocol}://${data.Server}`); // FILL WSS SERVER

    var configuration = {
      sockets: [socket],
      'uri': `sip:${data.ExtId}@${data.ExtDomain}`,
      //'password': `${data.Password}`,
      'password': `${data.ExtSecret}`,
      'username': `${data.ExtId}`,
      'register': true,
      'iceServers': [
        { 'urls': 'stun:stun.l.google.com:19302' }
      ]
    };

    this.phoneStatus.extension = data.ExtId;

    // this.incomingCallAudio = new window.Audio('/ringing.mp3');
    // this.incomingCallAudio.loop = true;
    // this.incomingCallAudio.crossOrigin = "anonymous";

    //JsSIP.debug.enable('JsSIP:*'); // more detailed debug output
    JsSIP.debug.disable();
    this.phone = new JsSIP.UA(configuration);


    this.remoteAudio = new window.Audio();
    this.remoteAudio.autoplay = true;
    this.remoteAudio.crossOrigin = "anonymous";

    this.phone.on('registered', function (ev) {
      if (funcOk) funcOk();
      if (window._onPhoneRegistered) window._onPhoneRegistered();

      _SipPhone.phoneStatus.isOnline = true;


      // request permission on page load
      if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');

      }
      else if (Notification.permission !== 'granted') {
        Notification.requestPermission();

      }



    });

    this.phone.on('disconnected', function (ev) {

      if (window._onPhoneUnregistered) window._onPhoneUnregistered();
      _SipPhone.phoneStatus.isOnline = false;
    })

    this.phone.on('unregistered', function (ev) {

      if (window._onPhoneUnregistered) window._onPhoneUnregistered();
    })

    this.phone.on('registrationFailed', function (ev) {
      console.log('Registering on SIP server failed with error: ' + ev.cause);
      configuration.uri = null;
      configuration.password = null;

      if (funcFailed) funcFailed();


      //updateUI();
    });
    this.phone.on('newRTCSession', function (ev) {
      var newSession = ev.session;

      if (_SipPhone.session && !_SipPhone.session.isEnded()) { // hangup any existing call
        //_SipPhone.session.terminate();

        return newSession.terminate();

      }
      _SipPhone.session = newSession;


      var completeSession = function () {


        //console.log('ended', _SipPhone.session);
        window._onStateChanged({
          state: 'ended',
          direction: _SipPhone.session.direction,
          //fromNumber: _SipPhone.session.remote_identity.uri.user,
        });

        _SipPhone.stopRinging();
        // _SipPhone.hangup();
        // _SipPhone.session = null;
        //updateUI();
      };


      var updateState = function (s) {

        var state = s;
        if (s === 'accept') state = 'incall';
        if (s === 'confirmed') state = 'incall';

        var ss = _SipPhone.session;

        var fromNumber = _SipPhone.session.remote_identity.uri.user;
        var toNumber = _SipPhone.session.local_identity.uri.user;

        if (ss.direction == 'outgoing') {
          var n = toNumber;
          toNumber = fromNumber;
          fromNumber = n;
        }
        if (!!ss) {
          window._onStateChanged({
            state: state,
            direction: ss.direction,
            fromNumber: fromNumber,
            toNumber: toNumber,
          });
        }

      };


      _SipPhone.session.on('ended', completeSession);

      _SipPhone.session.on('failed', completeSession);
      //_SipPhone.session.on('failed', completeSession);

      _SipPhone.session.on('accepted', function () { updateState('accepted') });

      _SipPhone.session.on('confirmed', function () {
        //console.log('confirmed 1');
        var localStream = _SipPhone.session.connection.getLocalStreams()[0];
        var dtmfSender = _SipPhone.session.connection.createDTMFSender(localStream.getAudioTracks()[0])
        _SipPhone.session.sendDTMF = function (tone) {
          dtmfSender.insertDTMF(tone);
        };

        updateState('confirmed');
      });
      _SipPhone.session.on('peerconnection', (e) => {
        //console.log('peerconnection', e);
        let logError = '';
        const peerconnection = e.peerconnection;

        peerconnection.onaddstream = function (e) {
          //console.log('addstream', e);
          // set remote audio stream (to listen to remote audio)
          // remoteAudio is <audio> element on pag
          _SipPhone.remoteAudio.srcObject = e.stream;
          _SipPhone.remoteAudio.play();
          _SipPhone.stopRinging();



        };

        var remoteStream = new MediaStream();
        //console.log(peerconnection.getReceivers());
        peerconnection.getReceivers().forEach(function (receiver) {
          //console.log(receiver);
          remoteStream.addTrack(receiver.track);
        });
      });

      if (_SipPhone.session.direction === 'incoming') {

        //console.log(_SipPhone.session);
        updateState('ringing');

        try {

          _SipPhone.callNotify();
        }
        catch (exc) {
          console.log('sound error', exc.message);
        }

      }
      else
      //outgoing
      {

        updateState('calling');

        _SipPhone.session.connection.addEventListener('addstream', function (e) {

          //console.log("addstream", _SipPhone.session);
          try {
            _SipPhone.stopRinging();
          }
          catch (exc) {

          }
          _SipPhone.remoteAudio.srcObject = e.stream;

        });
      }
      //updateUI();
    });

  },




  connect: function () {
    return this.phone && this.phone.start()

  },
  disconnect: function () {

    try {
      if (!!_SipPhone.session) { // hangup any existing call
        _SipPhone.session.terminate();
        _SipPhone.session = null;
      }
    }
    catch (e) {
      console.log(e);
    }

    return this.phone && this.phone.stop();
  },

  dial: function (dest, funcOk) {




    if (funcOk) {

      var coptions = {
        eventHandlers: {

          'confirmed': () => { funcOk(); },
        },

        mediaConstraints: { audio: true, video: false }
      };
      this.phone.call(dest, coptions);



    }
    else this.phone.call(dest, this.callOptions);
  },

  answer: function () {

    this.session.answer(this.callOptions);

  },

  hold: function () {

    this.session.hold();

  },

  unhold: function () {

    this.session.unhold();

  },

  mute: function () {

    this.session.mute();

  },

  unmute: function () {

    this.session.unmute();

  },

  sendDTMF: function (tone) {
    this.session.sendDTMF(tone);
  },


  showForward: function (callId) {
    window._onShowforward(callId);

  },
  hangup: function () {
    try {

      //console.log('hanging up', _SipPhone.session)

      window._onStateChanged({
        state: 'ended',
        direction: '',
        //toNumber: _SipPhone.session.remote_identity.uri.user,
      });

      if (!!_SipPhone.session && !_SipPhone.session.isEnded())
        _SipPhone.session.terminate();


    }
    catch (ex) {
      console.log(ex);
    }

    try {
      _SipPhone.stopRinging();

    }
    catch (exc) {
      console.log('sound error', exc);
    }

    try {

      //_SipPhone.remoteAudio.pause()
      //_SipPhone.remoteAudio = null;
    }
    catch (exc) {
      console.log('sound error', exc);
    }
    this.session = null;
  },

  onStateChanged: (func) => {

    window._onStateChanged = func;

  },
  onShowforward: (func) => {
    window._onShowforward = func;
  },

  onRegistered: (func) => {

    window._onPhoneRegistered = func;

  },

  onUnregistered: (func) => {

    window._onPhoneUnregistered = func;

  },



}

window.Phone = _SipPhone;




window.addEventListener("beforeunload", function (e) {


  _SipPhone.disconnect();
  // var confirmationMessage = "\o/";

  // (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  // return confirmationMessage;                            //Webkit, Safari, Chrome
});

