(function(win, doc, $) {
    function CusScrollBar(options) {
        this.__init__(options)
    }
   Object.assign(CusScrollBar.prototype, {
        __init__: function(options) {
            let self = this
            self.options = {
                scrollDir:  'y', // 滚动方向
                contentSelector: '', // 滚动内容区的选择器
                barSelector: '', // 滚动条的选择器
                sliderSelector: '', // 滚动滑块的选择器
                tabItemSelector: '.tab-item',
                tabActiveClass: 'tab-active',
                sectionSelector: '.anchor',
                wheelStep: 20, // 滚轮的步长，滚动移动距离
            }
            Object.assign(self.options, options || {})
            self.__initDomEvent__()
                .__calculateHeight__()
                .__initSliderHeight__()
                .__initSliderDragEvent__()
                .__bindContentScroll__()
                .__bindMouseScroll__()
                .__bindTabEvent__()
        },
        /**
         * 初始化DOM引用
         */
        __initDomEvent__: function() {
            let options = this.options
            this.$content = $(options.contentSelector)
            this.$slider = $(options.sliderSelector)
            this.$bar = options.barSelector ? $(options.barSelector) : this.$slider.parent()
            this.$tabItem = $(options.tabItemSelector)
            this.$doc = $(doc)
            return this
        },
        /**
         * 初始化滑块拖动功能
         */
        __initSliderDragEvent__: function() {
            let slider = this.$slider,
                sliderEl = slider[0],
                self = this
            if (sliderEl) {
                let doc = this.$doc,
                    dragStartPagePosition,
                    dragStartScrollPosition,
                    dragContentBarRate
                slider.on('mousedown', function(ev) {
                    // 鼠标按下
                    ev.preventDefault()
                    dragStartPagePosition = ev.pageY
                    dragStartScrollPosition = self.$content[0].scrollTop
                    dragContentBarRate = self.getMaxScrollPosition() / self.getMaxSliderPosition()
                    doc.on('mousemove.scroll', function(ev) {
                        // 鼠标移动
                        ev.preventDefault()
                        if(dragStartPagePosition === null) {
                            return
                        }
                        self.scrollTo(dragStartScrollPosition + (ev.pageY - dragStartPagePosition) * dragContentBarRate)
                    }).on('mouseup.scroll', function(ev) {
                        doc.off('.scroll')
                    })
                })
            }
            return this
        },
        //监听内容滚动， 同步滑块的位置
        __bindContentScroll__() {
            let self = this
            self.$content.on('scroll', () => {
                let sliderEl = self.$slider && self.$slider[0]
                if (sliderEl) {
                    sliderEl.style.top = `${self.getSliderPosition()}px`
                }
                for(let i=0; i<this.sectionHeight.length; i++) {
                    let height1 = this.sectionHeight[i]
                    let height2 = this.sectionHeight[i+1]
                    if (!height2 || this.$content[0].scrollTop > height1 && this.$content[0].scrollTop < height2) {
                        this.changeTabActive(i)
                        break;
                    }
                }
            })
            return this
        },
        // 监听鼠标滚轮事件
        __bindMouseScroll__() {
            this.$content.on("mousewheel DOMMouseScroll", (e) => {
                e.preventDefault()
                let originEv = e.originalEvent
                let wheelRange = originEv.wheelDelta ? -originEv.wheelDelta / 120 : (originEv.detail || 0) / 3;
                this.scrollTo(this.$content[0].scrollTop + wheelRange * this.options.wheelStep)
            })
            return this
        },
        __bindTabEvent__() {
            let self = this
            self.$tabItem.on('click', 'a', function(e) {
                e.preventDefault()
                let index = $(this).parent().index()
                let top = Math.min($($(this).attr('href')).position().top + self.$content.scrollTop(), self.getMaxScrollPosition()) 
                self.$content.stop().animate({
                    scrollTop: top
                }, {
                    duration: 500,
                    easing: 'easeInOutQuint'
                })
            })
            return this
        },
        __calculateHeight__() {
            let self = this
            self.sectionHeight = []
            let sectionHeight = self.sectionHeight
            let height = 0
            sectionHeight.push(height)
            $(self.options.sectionSelector).each(function() {
                height += $(this).height()
                sectionHeight.push(height)
            })
            return this
        },
        changeTabActive(index) {
            let activeClass = this.options.tabActiveClass
            this.$tabItem.eq(index).addClass(activeClass).siblings().removeClass(activeClass)
        },
        // 计算滑块当前应该的位置
        getSliderPosition() {
            let self = this,
                maxSliderPosition = self.getMaxSliderPosition()

            return Math.min(maxSliderPosition, maxSliderPosition * self.$content.scrollTop() / self.getMaxScrollPosition())
        },
        /**
         * 初始化滚动条滑块的高度
         */
        __initSliderHeight__() {
            let height = this.$content.height() / Math.max(this.$content.height(), this.$content[0].scrollHeight) * this.$bar.height()
            this.$slider.height(height)
            return this
        },
        // 内容可滚动高度
        getMaxScrollPosition() {
            let self = this
            return Math.max(self.$content.height(), self.$content[0].scrollHeight) - self.$content.height();
        },
        // 滑块可移动距离
        getMaxSliderPosition() {
            let self = this
            return self.$bar.height() - self.$slider.height();
        },
        /**
         * 滚动到哪个地方
         * @param {*} positionVal 滚动到的高度
         */
        scrollTo(positionVal) {
            let self = this
            self.$content.scrollTop(positionVal)
        }
    })
    win.CusScrollBar = CusScrollBar
})(window, document, jQuery)
