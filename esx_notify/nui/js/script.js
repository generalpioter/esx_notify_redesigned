const w = window;

const types = {
	["success"]: { icon: "check_circle", frequency: 800, duration: 100 },
	["error"]: { icon: "error", frequency: 300, duration: 150 },
	["info"]: { icon: "info", frequency: 600, duration: 100 },
	["warning"]: { icon: "warning_amber", frequency: 450, duration: 125 },
};


const codes = {
	"~r~": "#ff453a",
	"~b~": "#0a84ff",
	"~g~": "#32d74b",
	"~y~": "#ffd60a",
	"~p~": "#bf5af2",
	"~c~": "#8e8e93",
	"~m~": "#1c1c1e",
	"~u~": "#000000",
	"~o~": "#ff9f0a",
};


let audioContext;


document.addEventListener("click", initAudioContext, { once: true });
document.addEventListener("keydown", initAudioContext, { once: true });

function initAudioContext() {
	if (!audioContext) {
		audioContext = new (window.AudioContext || window.webkitAudioContext)();
	}
}

function playNotificationSound(type) {
	if (!audioContext) initAudioContext();

	const typeConfig = types[type] || types["info"];
	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();

	oscillator.type = "sine";
	oscillator.frequency.setValueAtTime(typeConfig.frequency, audioContext.currentTime);

	gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
	gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + typeConfig.duration / 1000);

	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);

	oscillator.start();
	oscillator.stop(audioContext.currentTime + typeConfig.duration / 1000);
}

w.addEventListener("message", (event) => {
	notification({
		type: event.data.type,
		title: event.data.title || "New Notification",
		message: event.data.message,
		length: event.data.length,
		position: event.data.position,
		notificationSoundEnabled: event.data.notificationSoundEnabled,
	});
});

const replaceColors = (str, obj) => {
	let strToReplace = str;

	for (const id in obj) {
		strToReplace = strToReplace.replace(new RegExp(id, "g"), obj[id]);
	}

	return strToReplace;
};

const sanitizeHTML = (str) => {
	const temp = document.createElement("div");
	temp.textContent = str;
	return temp.innerHTML;
};

const processLineBreaks = (str) => {

	return str.replace(/&lt;br&gt;/g, "<br>");
};

const notification = (data) => {
	if (typeof $ === "undefined") {
		console.error("jQuery is not loaded. Please ensure jQuery is included in your project.");
		return;
	}

	if (data.message) {

		data.message = data.message.replace(/~s~/g, "");
	}

	if (data.title) {

		data.title = data.title.replace(/~s~/g, "");
	}

	let sanitizedTitle = data.title ? sanitizeHTML(data.title) : "";
	let sanitizedMessage = data.message ? sanitizeHTML(data.message) : "";

	if (data.title) {
		for (const color in codes) {
			if (sanitizedTitle.includes(color)) {
				const objArr = {};
				objArr[color] = `<span style="color: ${codes[color]}">`;
				objArr["~s~"] = "</span>";
				sanitizedTitle = replaceColors(sanitizedTitle, objArr);
			}
		}
	}

	for (const color in codes) {
		if (sanitizedMessage.includes(color)) {
			const objArr = {};
			objArr[color] = `<span style="color: ${codes[color]}">`;
			objArr["~s~"] = "</span>";
			sanitizedMessage = replaceColors(sanitizedMessage, objArr);
		}
	}

	sanitizedMessage = processLineBreaks(sanitizedMessage);
	sanitizedTitle = processLineBreaks(sanitizedTitle);

	const id = Math.floor(Math.random() * 100000);
	const typeInfo = types[data.type] || types["info"];
	const duration = data.length || 3000;
	const containerToAppend = data.position ? `#${data.position}` : "#middle-right";

	if (!$(containerToAppend).length) {
		console.error(`Container ${containerToAppend} to add the notification not found.`);
		return;
	}

	const notificationElement = $(`
    <div id="${id}" class="notify notify-${data.type} fadeIn">
      <div class="notify-icon">
        <span class="material-symbols-outlined">${typeInfo.icon}</span>
      </div>
      <div class="notify-body">
        <div class="notify-row">
          <span class="notify-title">${sanitizedTitle}</span>
          <span class="notify-time">now</span>
        </div>
        <p class="notify-text">${sanitizedMessage}</p>
      </div>
      <div class="notify-progress"></div>
    </div>
  `).appendTo(containerToAppend);

	$(`#${id} .notify-progress`).css({
		transform: "scaleX(0)",
		transition: `transform ${duration}ms linear`,
	});

	if (data.notificationSoundEnabled) {
		playNotificationSound(data.type);
	}

	setTimeout(() => {
		$(`#${id} .notify-progress`).css("transform", "scaleX(1)");
	}, 10);

	setTimeout(() => {
		$(`#${id}`).removeClass("fadeIn").addClass("fadeOut");
		setTimeout(() => {
			$(`#${id}`).remove();
		}, 350);
	}, duration);

	return notificationElement;
};