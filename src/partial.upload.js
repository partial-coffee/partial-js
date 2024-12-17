// @ts-check

/**
 * @typedef {Object} config
 * @property {string} dropzoneSelector  - The dropzone element
 * @property {string} fileInputSelector - The file input element
 * @property {string} endpoint          - The URL to upload the file to
 * @property {string} resultTarget      - The object where the result should be displayed
 * @property {array} [fileType]         - The type of files to accept
 * @property {Object} [partial]         - The partial object
 * @property {string} [swapOption]      - The swap option
 */
class PartialUpload {
    constructor(config) {
        this.dropzone     = config.dropzoneSelector;
        this.fileInput    = config.fileInputSelector;
        this.endpoint     = config.endpoint || "/upload";
        this.resultTarget = config.resultTarget;
        this.partial      = config.partial;
        this.fileTypes    = config.fileType || ['image/*'];
        this.swapOption   = config.swapOption || 'outerHTML';

        this.destroyed    = false;
        this.boundEvents  = [];

        if(!this.partial){
            console.error('partial.js is required for this component to work');
            return;
        }

        this.init();
    }

    init() {
        this.addEvent(this.dropzone, "dragover", (event) => this.handleDragOver(event));
        this.addEvent(this.dropzone, "dragleave", (event) => this.handleDragLeave(event));
        this.addEvent(this.dropzone, "drop", (event) => this.handleDrop(event));
        this.addEvent(this.fileInput, "change", (event) => this.handleFileInputChange(event));
    }

    addEvent(element, eventName, handler) {
        if (element) {
            element.addEventListener(eventName, handler);
            this.boundEvents.push({ element, eventName, handler });
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        this.dropzone.classList.add('border-2', 'border-dashed', 'border-gray-200');
    }

    handleDragLeave(event) {
        event.preventDefault();
        this.dropzone.classList.remove('border-2', 'border-dashed', 'border-gray-200');
    }

    async handleDrop(event) {
        event.preventDefault();
        await this.handleFileUpload(event.dataTransfer.items);
    }

    async handleFileInputChange(event) {
        await this.handleFileUpload(event.target.files);
    }

    async handleFileUpload(files) {
        const formData = new FormData();
        formData.append('action', 'upload');

        for (let item of files) {
            const file = item.kind === 'file' ? item.getAsFile() : item;
            if (file && this.fileTypes.some(type => file.type.match(type))) {
                formData.append('files', file);
            } else {
                alert(`Only the following file types are supported: ${this.fileTypes.join(', ')}`);
                return;
            }
        }

        try {
            const headers = new Headers();
            headers.append('X-Action', 'upload');

            if (this.partial.csrfToken) {
                if (typeof this.partial.csrfToken === 'function') {
                    headers.append('X-CSRF-Token', this.partial.csrfToken());
                } else {
                    headers.append('X-CSRF-Token', this.partial.csrfToken);
                }
            }

            const response = await fetch(this.endpoint, {
                method: 'POST',
                body: formData,
                headers: headers
            });

            if (response.ok) {
                const body = await response.text();
                this.partial.performSwap(this.resultTarget, body, this.swapOption);
            } else {
                console.error('File upload failed', response);
            }
        } catch (error) {
            console.error('Error uploading file', error);
        }
    }

    destroy() {
        if (this.destroyed) return;
        this.boundEvents.forEach(({ element, eventName, handler }) => {
            element.removeEventListener(eventName, handler);
        });
        this.boundEvents = [];
        this.destroyed = true;
    }
}
