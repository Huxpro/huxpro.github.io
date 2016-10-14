$(document).ready(function(){
    $('#fullPage').fullpage({
        verticalCentered: false,
        //sectionsColor: ['aqua','crimson','green','darkviolet'],
        anchors: ['page1','page2','page3','page4'],
        navigation: true,
        navigationTooltips: ['一个学习者','兴趣爱好','项目经验','技能树'],
        //滚动到某一屏后产生的动画效果
        afterLoad: function(link, index){
            switch (index){
                case 1:
                    move('.section1 h1').scale(1.5).end();
                    move('.section1 img').scale(1.2).end();
                    move('.section1 p').set('margin-top','5%').end();
                    break;
                case 2:
                    move('.section2 h1').scale(0.7).end();
                    move('.section2 p').scale(0.7).end();
                    break;
                case 3:
                    move('.section3 h1').set('margin-left','20%').end();
                    move('.section3 p').set('margin-left','20%').end();
                    break;
                case 4:
                    move('.section4 img.primary').rotate(360).end(function(){
                        move('.section4 img.sport').rotate(360).end(function(){
                            move('.section4 img.edition').rotate(360).end(function(){
                                move('.section4 h4.primary').scale(1.2).end(function(){
                                    move('.section4 h4.sport').scale(1.2).end(function(){
                                        move('.section4 h4.edition').scale(1.2).end();
                                    });
                                });
                            });
                        });
                    });
                    break;
                default :
                    break;
            }
        },
        //离开某一屏后恢复到初始效果
        onLeave: function(link, index){
            switch (index){
                case 1:
                    move('.section1 h1').scale(1).end();
                    move('.section1 img').scale(1).end();
                    move('.section1 p').set('margin-top','800px').end();
                    break;
                case 2:
                    move('.section2 h1').scale(1).end();
                    break;
                case 3:
                    move('.section3 h1').set('margin-left','-1500px').end();
                    move('.section3 p').set('margin-left','1500px').end();
                    break;
                case 4:
                    move('.section4 img.primary').rotate(-360).end();
                    move('.section4 img.sport').rotate(-360).end();
                    move('.section4 img.edition').rotate(-360).end();
                    move('.section4 h4.primary').scale(1).end();
                    move('.section4 h4.sport').scale(1).end();
                    move('.section4 h4.edition').scale(1).end();
                    break;
                default :
                    break;
            }
        },
    })


});