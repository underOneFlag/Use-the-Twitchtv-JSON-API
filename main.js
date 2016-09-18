const _uOF = {};

_uOF.get = (url, cb) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => cb(null, xhr.responseText);
  xhr.onerror = (err) => cb(err);
  xhr.open('GET', url);
  xhr.send();
};

_uOF.twitch = {
	'endpoint': 'https://api.twitch.tv/kraken/',
	'streams': 'streams?channel=',
	'channel': 'channels/',
	'clientId': 'client_id=jzkbprff40iqj646a697cyrvl0zt2m6',
	getUrl: (ch, type) => {
		const query = type == 'streams' ? 
			_uOF.twitch.streams + ch.join(',') + '&' : 
			_uOF.twitch.channel + ch + '?';
		return _uOF.twitch.endpoint + query + _uOF.twitch.clientId;
	}
}

document.querySelectorAll('button').forEach(btn => {
	btn.onclick = function() {
		if(this.classList.contains('selected'))	return

		if(document.querySelector('.selected')) {
			document.querySelector('.selected').classList.remove('selected');
		}

		this.classList.add('selected');

		if(this.textContent == 'All') {
			document.querySelectorAll('.channels > :not(.empty)').
				forEach(chn => chn.classList.remove('hidden'));
		}
		else if(this.textContent == 'Online') {
			document.querySelectorAll('.online').
				forEach(chn => chn.classList.remove('hidden'));
			document.querySelectorAll('.channels > :not(.online)').
				forEach(chn => chn.classList.add('hidden'));
		}
		else {
			document.querySelectorAll('.channels > :not(.online)').
				forEach(chn => chn.classList.remove('hidden'));
			document.querySelectorAll('.online').
				forEach(chn => chn.classList.add('hidden'));
		}
	};
});

document.getElementsByTagName('input')[0].onkeyup = (event) => {
	const value = event.target.value;
	
	if(value.length < 2) {
		document.querySelector('button').
			onclick.call(document.querySelector('button'));
		return
	}

	const regx = RegExp(value, 'i');
	console.log(regx);
	document.querySelectorAll('.channels > *').
		forEach(x => x.classList.add('hidden'));

	const option = document.getElementsByClassName('selected');
	if(option.length > 0) option[0].classList.remove('selected');
	
	_uOF.streamers.filter(x => {
		console.log(x, regx, x.match(regx));
		return x.match(regx);
	}).forEach(x => {
		document.querySelector('[data-name=' + x + ']').
			classList.remove('hidden');
	});
};

_uOF.streamers = [
	"ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "brunofin",
	"storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404"
].map(x => x.toLowerCase());

_uOF.sectionElement = document.getElementsByTagName('section')[1];
_uOF.chnElement = document.getElementsByClassName('empty')[0];

_uOF.addStreamer = (channel, status) => {
	const channelElement = _uOF.chnElement.cloneNode(true);
	if(channel.url) channelElement.href = channel.url;
	channelElement.classList.remove('empty');
	channelElement.classList.add(status);
	channelElement.dataset.name = channel.name;

	const nodes = channelElement.childNodes;

	nodes[1].src = channel.logo || '';
	nodes[3].appendChild(document.createTextNode(channel.display_name));
	nodes[5].appendChild(document.createTextNode(channel.status || ''));

	channelElement.classList.remove('empty');
	
	if(status == 'not-exist') {
		_uOF.sectionElement.insertAdjacentElement('beforeend', channelElement);
	}
	else {
		_uOF.sectionElement.insertAdjacentElement('afterbegin', channelElement);
	}
};

_uOF.getChannel = (channel) => {
	_uOF.get(_uOF.twitch.getUrl(channel, 'channel'), (err, data) => {
		if(err) return console.error(err.message);

		data = JSON.parse(data);

		if(data.error) {
			const obj = {
				'status': 'Channel does not exist',
				'display_name': channel,
				'name': channel
			};
			_uOF.addStreamer(obj, 'not-exist');
		}
		else{
			_uOF.addStreamer(data, 'offline');
		}
	});
};

_uOF.getStreams = () => {
	_uOF.get(_uOF.twitch.getUrl(_uOF.streamers, 'streams'), (err, data) => {
		if(err) return console.error(err.message);

		console.log(JSON.parse(data));
		console.log(_uOF.streamers);
		JSON.parse(data).streams.forEach(stream => {
			_uOF.streamers.splice(_uOF.streamers.indexOf(stream.channel.name), 1);
			_uOF.addStreamer(stream.channel, 'online');
			console.log(_uOF.streamers);
		});

		_uOF.streamers.forEach(channel => _uOF.getChannel(channel));
	});
};

_uOF.getStreams();