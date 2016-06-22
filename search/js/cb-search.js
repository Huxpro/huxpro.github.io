 $(document).ready(function () {
        var time1 = 0;
        var show = false;
        var names = new Array(); //文章名字等
        var urls = new Array(); //文章地址
        $(document).keyup(function (e) {
            var time2 = new Date().getTime();
            if (e.keyCode == 17) {
                var gap = time2 - time1;
                time1 = time2;
                if (gap < 500) {
                    if (show) {
                        $(".search-tool").css("display", "none");
                        show = false;
                    } else {
                        $(".search-tool").css("display", "block");
                        show = true;
                        $("#search-content").val("");
                        $("#search-content").focus();
                    }
                    time1 = 0;
                }
			}else if(e.keyCode == 27){
                    $(".search-tool").css("display", "none");
                    show = false;
                    time1 = 0;
                }
        });

 		$("#search-content").keyup(function (e) {
            var time2 = new Date().getTime();
            if (window.event.keyCode == 17) {
                var gap = time2 - time1;
                time1 = time2;
                if (gap < 500) {
                    if (show) {
                        $(".search-tool").css("display", "none");
                        show = false;
                    } else {
                        $(".search-tool").css("display", "block");
                        show = true;
                        $("#search-content").val("");
                        $("#search-content").focus();
                    }
                    time1 = 0;
                }
            }
        });

        $("#close-btn").click(function () {
            $(".search-tool").css("display", "none");
            show = false;
            time1 = 0;
        });

        $("#search-btn").click(function(){
            $(".search-tool").css("display", "block");
            show = true;
            $("#search-content").val("");
            $("#search-content").focus();
            time1 = 0;
        });

        $.getJSON("/search/cb-search.json").done(function (data) {
            if (data.code == 0) {
                for (var index in data.data) {
                    var item = data.data[index];
                    names.push(item.title);
                    urls.push(item.url);
                }

                $("#search-content").typeahead({
                    source: names,

                    afterSelect: function (item) {
						$(".search-tool").css("display", "none");
                        show = false;
                        window.location.href = (urls[names.indexOf(item)]);
                        return item;
                    }
                });
            }
        });

    });
