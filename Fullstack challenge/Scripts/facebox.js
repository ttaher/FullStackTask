/*
 * Facebox (for jQuery)
 * version: 1.2 (05/05/2008)
 * @requires jQuery v1.2 or later
 *
 * Examples at http://famspam.com/facebox/
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2007, 2008 Chris Wanstrath [ chris@ozmm.org ]
 *
 * Usage:
 *
 *  jQuery(document).ready(function() {
 *    jQuery('a[rel*=facebox]').facebox()
 *  })
 *
 *  <a href="#terms" rel="facebox">Terms</a>
 *    Loads the #terms div in the box
 *
 *  <a href="terms.html" rel="facebox">Terms</a>
 *    Loads the terms.html page in the box
 *
 *  <a href="terms.png" rel="facebox">Terms</a>
 *    Loads the terms.png image in the box
 *
 *
 *  You can also use it programmatically:
 *
 *    jQuery.facebox('some html')
 *    jQuery.facebox('some html', 'my-groovy-style')
 *
 *  The above will open a facebox with "some html" as the content.
 *
 *    jQuery.facebox(function($) {
 *      $.get('blah.html', function(data) { $.facebox(data) })
 *    })
 *
 *  The above will show a loading screen before the passed function is called,
 *  allowing for a better ajaxy experience.
 *
 *  The facebox function can also display an ajax page, an image, or the contents of a div:
 *
 *    jQuery.facebox({ ajax: 'remote.html' })
 *    jQuery.facebox({ ajax: 'remote.html' }, 'my-groovy-style')
 *    jQuery.facebox({ image: 'stairs.jpg' })
 *    jQuery.facebox({ image: 'stairs.jpg' }, 'my-groovy-style')
 *    jQuery.facebox({ div: '#box' })
 *    jQuery.facebox({ div: '#box' }, 'my-groovy-style')
 *
 *  Want to close the facebox?  Trigger the 'close.facebox' document event:
 *
 *    jQuery(document).trigger('close.facebox')
 *
 *  Facebox also has a bunch of other hooks:
 *
 *    loading.facebox
 *    beforeReveal.facebox
 *    reveal.facebox (aliased as 'afterReveal.facebox')
 *    init.facebox
 *    afterClose.facebox
 *
 *  Simply bind a function to any of these hooks:
 *
 *   $(document).bind('reveal.facebox', function() { ...stuff to do after the facebox and contents are revealed... })
 *
 */
(function ($) {
    $.facebox = function (data, klass,faceboxClass) {
        $.facebox.loading()
        if (data.ajax) fillFaceboxFromAjax(data.ajax, klass)
        else if (data.image) fillFaceboxFromImage(data.image, klass)
        else if (data.div) fillFaceboxFromHref(data.div, klass)
        else if ($.isFunction(data)) data.call($)
        else $.facebox.reveal(data, klass, faceboxClass)
        
    }
   
    /*
     * Public, $.facebox methods
     */

    $.extend($.facebox, {
        settings: {
            opacity: 0.7,
            overlay: true,
            loadingImage: '/Content/images/loading.gif',
            closeImage: '/Content/images/closelabel.png',
            imageTypes: ['png', 'jpg', 'jpeg', 'gif'],
            faceboxHtml: '\
    <div id="facebox" style="display:none;"> \
      <div class="popupf"> \
        <div class="content1"> \
        </div> \
        <a href="javascript:;" class="close"><img src="/Content/images/closelabel.png" title="close" class="close_image" id="closelabelpng"  /></a> \
      </div> \
    </div>'
        },

        loading: function () {
            init()
            if ($('#facebox .loading').length == 1) return true
            showOverlay()
            //$('#facebox').resize(function () {
            //    $(this).css('left', $(window).width() / 2 - ($('#facebox .popupf').width() / 2));
            //    $(this).css('top', getPageHeight() / 2 - ($('#facebox .popupf').height() / 2));
            //});
            //$(document).scroll(function () {
            //    $(this).css('left', $(window).width() / 2 - ($('#facebox .popupf').width() / 2));
            //    $(this).css('top', getPageHeight() / 2 - ($('#facebox .popupf').height() / 2));
            //});
            $('#closelabelpng').hide();
            $('#facebox .content1').empty()
            $('#facebox .content1').children().hide().end().
            append('<div class="loading" ><img src="' + $.facebox.settings.loadingImage + '" /></div>')
          
            $('#facebox').css({
                top: 0,//getPageHeight() / 3 - ($('#facebox .popupf').height() / 2),
                left: $(window).width() / 2 - ($('#facebox .popupf').width() / 2)
            }).css('opacity', 0).css('padding-top', 0).show()
  .animate(
    { opacity: 1, },
    { queue: false }
  );

            //.show()



            $(document).bind('keydown.facebox', function (e) {
                if (e.keyCode == 27) $.facebox.close()
                return true
            })
            $(document).trigger('loading.facebox')
        },

        reveal: function (data, klass, faceboxClass) {
            $(document).trigger('beforeReveal.facebox')
            if (klass) $('#facebox .content1').addClass(klass)
            if (faceboxClass) $('#facebox').addClass(faceboxClass)
            $('#facebox .content1').html(data)
            $('#facebox .loading').remove()
            $('#closelabelpng').show();
            $('#facebox .body').children().fadeIn('normal')
            var newLeft = parseFloat($(window).width() / 2 - ($('#facebox .popupf').width() / 2)) < 0 ? 0 : $(window).width() / 2 - ($('#facebox .popupf').width() / 2);
            var newTop = parseFloat(getPageHeight() / 3 - ($('#facebox .popupf').height() / 2)) < 0 ? 0 : getPageHeight() / 3 - ($('#facebox .popupf').height() / 2);
            $('#facebox').css('left', newLeft);
            $('#facebox').css('top', newTop);
            if ($(window).width() <= 850) {
                $('#facebox').css('left', 0);
                $('#facebox').css('top', 0);
            }

           
            $(document).trigger('reveal.facebox').trigger('afterReveal.facebox')


            if (typeof HideCloseFaceBoxIcon == 'function') {
                HideCloseFaceBoxIcon();
            }

        },

        close: function () {
            $(document).trigger('close.facebox')
            return false
        }
    })

    /*
     * Public, $.fn methods
     */

    $.fn.facebox = function (settings) {
        if ($(this).length == 0) return

        init(settings)

        function clickHandler() {
            $.facebox.loading(true)

            // support for rel="facebox.inline_popup" syntax, to add a class
            // also supports deprecated "facebox[.inline_popup]" syntax
            //var klass = this.rel.match(/facebox\[?\.(\w+)\]?/)
            //if (klass) klass = klass[1]
            var klass = "";
            if (this.rel != null && this.rel != undefined && this.rel != "") {
                var divId = this.rel;
                fillFaceboxFromHref(divId, klass)
            } else {
                fillFaceboxFromHref($(this).attr("ajax"), klass);
            }
            return false
        }

        return this.bind('click.facebox', clickHandler)
    }

    /*
     * Private methods
     */

    // called one time to setup facebox on this page
    function init(settings) {
        if ($.facebox.settings.inited) return true
        else $.facebox.settings.inited = true

        $(document).trigger('init.facebox')
        makeCompatible()

        var imageTypes = $.facebox.settings.imageTypes.join('|')
        $.facebox.settings.imageTypesRegexp = new RegExp('\.(' + imageTypes + ')$', 'i')

        if (settings) $.extend($.facebox.settings, settings)
        $('body').append($.facebox.settings.faceboxHtml)

        var preload = [new Image(), new Image()]
        preload[0].src = $.facebox.settings.closeImage
        preload[1].src = $.facebox.settings.loadingImage

        $('#facebox').find('.b:first, .bl').each(function () {
            preload.push(new Image())
            preload.slice(-1).src = $(this).css('background-image').replace(/url\((.+)\)/, '$1')
        })

        $('#facebox .close').click($.facebox.close)
        $('#facebox .close_image').attr('src', $.facebox.settings.closeImage)
    }

    // getPageScroll() by quirksmode.com
    function getPageScroll() {
        var xScroll, yScroll;
        if (self.pageYOffset) {
            yScroll = self.pageYOffset;
            xScroll = self.pageXOffset;
        } else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
            yScroll = document.documentElement.scrollTop;
            xScroll = document.documentElement.scrollLeft;
        } else if (document.body) {// all other Explorers
            yScroll = document.body.scrollTop;
            xScroll = document.body.scrollLeft;
        }
        return new Array(xScroll, yScroll)
    }

    // Adapted from getPageSize() by quirksmode.com
    function getPageHeight() {
        var windowHeight
        if (self.innerHeight) {	// all except Explorer
            windowHeight = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
            windowHeight = document.documentElement.clientHeight;
        } else if (document.body) { // other Explorers
            windowHeight = document.body.clientHeight;
        }
        return windowHeight
    }

    // Backwards compatibility
    function makeCompatible() {
        var $s = $.facebox.settings

        $s.loadingImage = $s.loading_image || $s.loadingImage
        $s.closeImage = $s.close_image || $s.closeImage
        $s.imageTypes = $s.image_types || $s.imageTypes
        $s.faceboxHtml = $s.facebox_html || $s.faceboxHtml
    }

    // Figures out what you want to display and displays it
    // formats are:
    //     div: #id
    //   image: blah.extension
    //    ajax: anything else
    function fillFaceboxFromHref(href, klass) {
        // div
        if (href.match(/#/)) {
            var url = window.location.href.split('#')[0]
            var target = href.replace(url, '')
            if (target == '#') return
            $.facebox.reveal($(target).html().replace(/amp;/g, ""), klass)

            // image
        } else if (href.match($.facebox.settings.imageTypesRegexp)) {
            fillFaceboxFromImage(href, klass)
            // ajax
        } else {
            fillFaceboxFromAjax(href, klass)
        }
    }

    function fillFaceboxFromImage(href, klass) {
        var image = new Image()
        image.onload = function () {
            $.facebox.reveal('<div class="image"><img src="' + image.src + '" /></div>', klass)
        }
        image.src = href
    }

    function fillFaceboxFromAjax(href, klass) {
        $.ajax({
            type: "GET",
            url: href,
            cache: false,
            success: function (result) {
                $.facebox.reveal(result, klass)
            },
            error: function (response) {
            },
            data: {
            }
        });
        //$.get(href, function(data) { $.facebox.reveal(data, klass) })
    }

    function skipOverlay() {
        return $.facebox.settings.overlay == false || $.facebox.settings.opacity === null
    }

    function showOverlay() {
        if (skipOverlay()) return

        if ($('#facebox_overlay').length == 0)
            $("body").append('<div id="facebox_overlay" class="facebox_hide"></div>')

        $('#facebox_overlay').hide().addClass("facebox_overlayBG")
          .css('opacity', $.facebox.settings.opacity)
          //.click(function() { $(document).trigger('close.facebox') })
          .fadeIn(200)
        return false
    }

    function hideOverlay() {
        if (skipOverlay()) return

        $('#facebox_overlay').fadeOut(200, function () {
            $("#facebox_overlay").removeClass("facebox_overlayBG")
            $("#facebox_overlay").addClass("facebox_hide")
            $("#facebox_overlay").remove()
        })

        return false
    }

    /*
     * Bindings
     */

    $(document).bind('close.facebox', function () {
        $(document).unbind('keydown.facebox')
        $('#facebox').fadeOut(function () {
            $('#facebox .content1').removeClass().addClass('content1')
            $('#facebox .loading').remove()
            $(document).trigger('afterClose.facebox')
        })
        hideOverlay()
    })

})(jQuery);
