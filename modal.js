class Modal {
    /**
     * Variable for saving HTML's node with modal window
     */
    node;
    constructor(content) {
        this.title = content.title;
        this.text = content.text;
        this.buttons = content.buttons;
    }

    /**
     * Method for presenting modal window
     */
    present() {
        this.node = document.createElement('div');
        this.node.classList.add('modal');
        this.node.innerHTML = this.generateHtml();
        document.querySelector('.sandbox').appendChild(this.node);
    }

    /**
     * Method for dismissing modal window
     */
    dismiss() {
        document.querySelector('.sandbox').removeChild(this.node);
    }

    /**
     * Method for generating HTML markup
     * @returns {string}
     */
    generateHtml() {
        const buttons = this.buttons.reduce((res, btn) => {
            return res + `<div class="modal__btn ${btn?.class}">${btn.title}</div>`;
        }, '')
        return `
            <div class="modal__content">
                <h5 class="modal__header">${this.title}</h5>
                <div class="modal__text">${this.text}</div>
                <div class="modal__btns-group">
                    ${buttons}
                </div>
            </div>
            `;
    }
}