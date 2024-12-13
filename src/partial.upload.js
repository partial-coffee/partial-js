// @ts-check

/**
 *     const uploader = new FileUploader({
 *         dropzoneId: "dropzone",
 *         fileInputId: "dropzone-file",
 *         endpoint: "/admin/media/upload-image/{{ .Data.Entity }}/{{ .Data.EntityUUID }}",
 *         resultTarget: "#imageResults",
 *         fileTypes: ['image/*', 'application/pdf']
 *     });
 */

/**
 * @typedef {Object} config
 * @property {string} dropzoneSelector  - The id of the dropzone element
 * @property {string} fileInputSelector - The id of the file input element
 * @property {string} endpoint          - The URL to upload the file to
 * @property {string} resultTarget      - The id of the element where the result should be displayed
 * @property {array} [fileType]         - The type of files to accept
 * @property {Object} [partial]         - The partial object
 */
class PartialUpload {
    constructor(config) {
        this.dropzone     = document.querySelector(config.dropzoneSelector) || "#partialupload-dropzone";
        this.fileInput    = document.querySelector(config.fileInputSelector) || "#partialupload-file";
        this.endpoint     = config.endpoint || "/upload";
        this.resultTarget = config.resultTarget || "#partialupload-result";
        this.partial      = window.partial || config.partial;
        this.fileTypes    = config.fileType || ['image/*'];

        if(!this.partial){
            console.error('partial.js is required for this component to work');
            return;
        }

        this.init();
    }

    init() {
        this.dropzone.addEventListener("dragover", (event) => this.handleDragOver(event));
        this.dropzone.addEventListener("dragleave", (event) => this.handleDragLeave(event));
        this.dropzone.addEventListener("drop", (event) => this.handleDrop(event));
        this.fileInput.addEventListener("change", (event) => this.handleFileInputChange(event));
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
            const response = await fetch(this.endpoint, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const body = await response.text();
                this.partial.performSwap(this.resultTarget, body, 'outerHTML');

            } else {
                console.error('File upload failed', response);
            }
        } catch (error) {
            console.error('Error uploading file', error);
        }
    }
}