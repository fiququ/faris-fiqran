class LoadingBar {
	constructor(options) {
		this.domElement = document.createElement("div");
		this.domElement.style.position = 'fixed';
		this.domElement.style.top = '0';
		this.domElement.style.left = '0';
		this.domElement.style.width = '100%';
		this.domElement.style.height = '100%';
		this.domElement.style.background = '#6e4d37'; // Brown color
		this.domElement.style.opacity = '0.7';
		this.domElement.style.display = 'flex';
		this.domElement.style.flexDirection = 'column'; // Align children vertically
		this.domElement.style.alignItems = 'center';
		this.domElement.style.justifyContent = 'center';
		this.domElement.style.zIndex = '1111';

		const text = document.createElement("div");
		text.textContent = "WELCOME TO XR COLLEGE";
		text.style.fontSize = '40px';
		text.style.fontWeight = 'bold';
		text.style.fontFamily = 'sans-serif';
		text.style.color = '#fff'; // White color for text
		text.style.textAlign = 'center';
		this.domElement.appendChild(text);

		const barBase = document.createElement("div");
		barBase.style.background = '#ffa500'; // Orange color
		barBase.style.width = '50%';
		barBase.style.minWidth = '250px';
		barBase.style.borderRadius = '10px';
		barBase.style.height = '15px';
		this.domElement.appendChild(barBase);

		const bar = document.createElement("div");
		bar.style.background = '#22a';
		bar.style.borderRadius = '10px';
		bar.style.height = '100%';
		bar.style.width = '0';
		barBase.appendChild(bar);
		this.progressBar = bar;

		document.body.appendChild(this.domElement);
	}

	set progress(delta) {
		const percent = delta * 100;
		this.progressBar.style.width = `${percent}%`;
	}

	set visible(value) {
		if (value) {
			this.domElement.style.display = 'flex';
		} else {
			this.domElement.style.display = 'none';
		}
	}
}

export { LoadingBar };
