// console.log(document.querySelector('modal__btn').dataset.modal-btn);

class Modal{
    constructor(options) {
        let defaultOptions = {
            isOpen: () => {},
            isClose: () =>{},
        }
        this.options = Object.assign(defaultOptions, options);
        this.modal = document.querySelector('.modal');
        this.speed = false;
        this.animation = false;
        this.isOpen = false;
        this.modalContainer = false;
        this.previousActiveElement = false;
        this.fixBlocks = document.querySelectorAll('.fix-block');
        this.focusElements = [
            'a[href]',
            'input',
            'button',
            'select'
        ];
        this.events();
    }

    events() {
        if (this.modal) {
            document.addEventListener('click', function(e) {
                const clickElement = e.target.closest('[data-modal_btn]');
                console.log(clickElement)
                if (clickElement) {
                    let target = clickElement.dataset.modal_btn;
                    let animation = clickElement.dataset.animation;
                    let speed = clickElement.dataset.speed;
                    this.animation = animation ? animation : 'fade';
                    this.speed = speed ? parseInt(speed) : '300';
                    this.modalContainer = document.querySelector(`[data-modal_target = "${target}"]`)
                    this.open();
                    console.log(this.modalContainer)
                    return;
                }

                if (e.target.closest('.modal__close-btn')) {
                    this.close();
                    return;
                }
            }.bind(this));

            window.addEventListener('keydown', function(e) {
                if (e.keyCode == 27) {
                    if (this.isOpen){
                    this.close();
                    }
                }

                if (e.keyCode == 9 && this.isOpen){
                    this.focusCatch(e);
                    return;
                }
            }.bind(this));

            this.modal.addEventListener('click', function(e) {
                if (e.target == this.modal) {
                    if (this.isOpen){
                    this.close();
                    }
                }
            }.bind(this));
        }
    }

    open() {
            this.previousActiveElement = document.activeElement;
            this.modal.style.setProperty(`--transition-time`, `${this.speed / 1000}s`);
            this.modal.classList.add('is-open');
            this.disableScroll();
            this.modalContainer.classList.add('modal-open');
            this.modalContainer.classList.add(this.animation);
            setTimeout(() => {
                this.options.isOpen(this);
                this.modalContainer.classList.add('anime-open');
                this.isOpen = true;
                this.focusTrap();
            }, this.speed);
    }

    close(){
        if (this.modalContainer) {
            this.modalContainer.classList.remove('anime-open');
            this.modalContainer.classList.remove(this.animation);
            this.modal.classList.remove('is-open');
            this.modalContainer.classList.remove('modal-open');
            this.enableScroll();
            this.options.isClose(this);
            this.isOpen = false;
            this.focusTrap();
        }
    }

    disableScroll(){
        let pagePosition = window.scroll;
        this.lockPadding();
        document.body.classList.add('disable-scroll');
        document.body.dataset.position = pagePosition;
        document.body.style.top = -pagePosition + 'px';
    }

    enableScroll() {
        let pagePosition = parseInt(document.body.dataset.position, 10);
        this.unlockPadding();
        document.body.style.top = 'auto';
        document.body.classList.remove('disable-scroll');
        window.scroll({top: pagePosition, left: 0})
        document.body.removeAttribute('data-position');
    }

    lockPadding() {
        let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
        this.fixBlocks.forEach((el) => {
            el.style.paddingRight = paddingOffset;
        });
        document.body.style.paddingRight = paddingOffset;
    }

    unlockPadding() {
        this.fixBlocks.forEach((el) => {
            el.style.paddingRight = '0px';
        });
        document.body.style.paddingRight = '0px';     
    }

    focusCatch(e) {
        const focusable = this.modalContainer.querySelectorAll(this.focusElements);
        const focusArray = Array.prototype.slice.call(focusable);
        const focusedIndex = focusArray.indexOf(document.activeElement);
        console.log(focusArray)
        if (e.shiftKey  && focusedIndex === 0) {
            focusArray[focusArray.length - 1].focus();
            e.preventDefault();
        }

        if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
            focusArray[0].focus();
            e.preventDefault();

        }
        return this.focusArray;

    }
   

    focusTrap() {
        const focusable = this.modalContainer.querySelectorAll(this.focusElements);
        if (this.isOpen) {
            focusable[0].focus();
        } else {
            this.previousActiveElement.focus();
        }

    }
}
const modal = new Modal({
    isOpen: () => {
    console.log('open');
    },
    isClose: () =>{
        console.log('close');
    },
});