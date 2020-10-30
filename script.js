/*정리타임!!
    1. 켄버스로 글씨쓰기
    2. 

    
*/

/*What makes Argia different from other cities is that
it has earth instead of air. The streets are completely
filled with dirt, clay packs the rooms to the ceiling,
on every stair another stairway is set in negative,
over the roofs of the houses hang layers of rocky terrain like skies with clouds. We do not know if the
inhabitants can move about the city, widening the
worm tunnels and the crevices where roots twist:
the dampness destroys people's bodies and they have
scant strength; everyone is better off remaining still,
prone; anyway, it is dark.
From up here, nothing of Argia can be seen; some
say, "It's down below there," and we can only believe them. The place is deserted. At night, putting
your ear to the ground, you can sometimes hear a
door slam. */


function Banner() {

    var keyword = "ARGIA, CITYS & THE DEAD"; // 맨트 길어지면 문제가 생김

    var fontSizeis_to = 70;
    var fontSizeis;
    var canvas;
    var context;
    var state = 0;

    var start_xpt = 100; // FIXME: 시점좌표, 이것도 비율로 할 필요가 있음
    var start_ypt = 400;

    var movingRat = 0.5;
    var darkenRat = 0.4; //어두운 비율


    var lines;
    var reuptext = 10; // 텍스트 위로 올리는 라인
    var saveMouseCount = 2;

    var bgCanvas;
    var bgContext;

    var denseness = 2; //픽셀사이즈와 간격

    //Each particle/icon
    var parts = [];

    var mouse = { x: -100, y: -100 };
    var mouseOnScreen = false;
    var mouseClickCount = 1;

    var itercount = [];
    var itertot = 100; // 속도와 관련

    // 캔버스 만들기! , 콘텍스트는 캔버스 불러올때 쓰는것임.
    this.initialize = function(canvas_id) {
        canvas = document.getElementById(canvas_id);
        context = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = 2 * window.innerHeight;

        bgCanvas = document.createElement('canvas');
        bgContext = bgCanvas.getContext('2d');
        canvass = document.createElement('canvas');
        contextss = canvass.getContext('2d');

        fontSizeis = fontSizeis_to * canvas.width / 1000;

        bgCanvas.width = window.innerWidth;
        bgCanvas.height = 2 * window.innerHeight;
        canvass.width = window.innerWidth;
        canvass.height = 2 * window.innerHeight;

        canvas.addEventListener('mousemove', MouseMove, false);
        canvas.addEventListener('mouseout', MouseOut, false);

        canvas.addEventListener('click', Click, false);


        transparentCanvas = null;

        start();
    }

    var start = function() {
        //다중라인작성
        var s_xpt = start_xpt;

        var s_ypt = start_ypt;
        drawString(bgContext, keyword, s_xpt, s_ypt, '#000', 0, "Spoqa Han Sans", fontSizeis);

        transparentCanvas = _createNoisyImage(canvas.width, canvas.height, 10, 0.3 //, colorcode.color
            //this.width, this.height, this.opacity, this.density, this.colorNoise.color
        );


        clear();
        getCoords();
    }

    // 여러줄로 글 작성하는 코드! , 자간설정가능
    function drawString(ctx, text, posX, posY, textColor, rotation, font, fontSize) {
        lines = text.split("\n");
        //없을경우 디폴트값 부여
        if (!rotation) rotation = 0;
        if (!font) font = "'serif'";
        if (!fontSize) fontSize = 16;
        if (!textColor) textColor = '#000000';
        ctx.save();
        ctx.font = fontSize + "px " + font;
        ctx.fillStyle = textColor;
        ctx.translate(posX, posY);
        ctx.rotate(rotation * Math.PI / 180);
        for (i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 0, i * fontSize * 1.4); //뒤에 자간 곱해주기!
        }
        ctx.restore();
    }

    function _createNoisyImage(width, height, opacity, density) {
        var canvas = document.createElement('canvas'),
            ctx, i, x, y;
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');
        for (i = 0; i < width * height * density / 100; i += 1) {
            x = Math.floor(Math.random() * width);
            y = Math.floor(Math.random() * height);
            op = Math.random() * opacity / 100;
            ctx.fillStyle = '#' + (Math.floor(Math.random() * 0x100) * 0x10101).toString(16); //'#ffffff'; //'rgba(' + noisyColor.r + ', ' + noisyColor.g + ', ' + noisyColor.b + ', ' + op + ')'; //노이지한 알지비가 각각 들어간게 fillstyle에 넣어짐.
            ctx.fillRect(Math.floor(x / denseness) * denseness, Math.floor(y / denseness) * denseness, denseness, denseness);
        }
        return canvas;
    }

    // 클리어 : 콘텍스트 값 설정(백그라운드랑 같음)
    var clear = function() {
        //


        context.fillStyle = '#fff'; //배경색 설정
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height); // 사이즈 설정!
        context.closePath();
        context.fill();


        //context.drawImage(canvas.transparentCanvas, 0, 0, canvas.width, canvas.height);
        context.drawImage(transparentCanvas, 0, 0);
    }



    // bg에 그린것들을 받아오는 부분. 각 줄마다 넘버를 부여하는걸로 진행!
    var getCoords = function() {
        var imageData, pixel, height, width, linelen, height_spot;

        imageData = bgContext.getImageData(0, 0, canvas.width, canvas.height); // 캔버스 사이즈로 이미지를 받아오는것.


        // quickly iterate over all pixels - leaving density gaps
        for (i = 0; i < lines.length; i++) {
            linelen = (fontSizeis * 1.4); //bgCanvas.height / lines.length;
            parts[i] = new Array;

            for (height = 0; height < linelen; height += denseness) {
                height_spot = start_ypt + 10 + height + Math.floor((i - 1) * linelen);

                for (width = 0; width < bgCanvas.width; width += denseness) {

                    pixel = imageData.data[((width + (height_spot * bgCanvas.width)) * 4) - 1];
                    //Pixel is black from being drawn on. 
                    if (pixel == 255) {
                        drawCircle(width, height_spot, i);

                    }
                }
            }
        }

        setInterval(update, 40);
    }

    var drawCircle = function(x, y, idx) {

        var startx = x + ((0.5 - Math.random()) * canvas.width / 80);
        if (idx > reuptext) {
            y = y - Math.floor((reuptext - 1) * (fontSizeis * 1.4));
        }
        var starty = y + ((0.5 - Math.random()) * canvas.height / 80);
        var velx = (x - startx) / itertot;
        var vely = (y - starty) / itertot;

        itercount[idx] = 0;


        if (Math.random() < darkenRat) { // 해당 확률의 경우 움직임
            parts[idx].push({ // 숫자가 높을수록 밝음. 나누기를 해줘야겠군.
                c: Math.floor(Math.random() * 0x100), //(Math.floor(Math.random() * 0x100) * 0x10101).toString()
                cc: true,
                x: x, //goal position
                y: y,
                x2: startx, //start position
                y2: starty,
                x3: startx,
                y3: starty,
                count: 0,
                r: true, //Released (to fly free!)
                v: { x: velx, y: vely } //속도인가봐..
            })
        } else {
            parts[idx].push({ //해당 확률이외는 안움직임
                c: Math.floor(Math.random() * 0x100),
                cc: false,
                x: startx, //goal position
                y: starty,
                x2: x, //start position
                y2: y,
                x3: x,
                y3: y,
                count: 0,
                r: true, //Released (to fly free!)
                v: { x: velx, y: vely } //속도인가봐..
            })
        }

    }









    // FIXME:###################################################################################################



    var update = function() {
        var i, dx, dy, sqrDist, scale;
        //itercount++;
        clear();

        // it's for each pixels.
        for (j = 0; j < lines.length; j++) {

            if (mouseClickCount > j) { //클릭이 진행되면, 카운트가 시작하는거지
                itercount[j]++;
                for (i = 0; i < parts[j].length; i++) {

                    //If the dot has been released
                    if (parts[j][i].r == true) { // 움직이는중이면
                        //Fly into infinity!!
                        parts[j][i].x2 += parts[j][i].v.x; // 속도가 더해지는 시점.
                        parts[j][i].y2 += parts[j][i].v.y;

                        if (parts[j][i].cc == true && parts[j][i].c < 0xf3 && parts[j][i].c > 5) {
                            parts[j][i].c -= 1;
                            if (parts[j][i].c < 0x5) {
                                parts[j][i].c = 0x0;
                                parts[j][i].cc = false;
                                parts[j][i].r = false;
                            } else if (parts[j][i].c > 0x100) { parts[j][i].c = 0x99; }
                        }
                        if (parts[j][i].c > 5 && parts[j][i].cc == true) { //선택된 것 중에서 c가 5보다 큰것은 어두워짐??
                            parts[j][i].c -= 1;
                            if (parts[j][i].c < 0x5) {
                                parts[j][i].c = 0x0;
                                parts[j][i].cc = false;
                                parts[j][i].r = false;
                            } else if (parts[j][i].c > 0x100) { parts[j][i].c = 0x99; }

                        }

                        //Perhaps I should check if they are out of screen... and kill them?
                    }


                    /*if (itercount[j] == itertot) { //종료되는 시점 속도 재설정, 
                        parts[j][i].v = { x: (Math.random() * 6) * 2 - 6, y: (Math.random() * 6) * 2 - 6 };
                        (속도값을 설정해주는건데)
                        parts[j][i].r = false;
                    }*/


                    //마우스와 각 점의 거리
                    dx = parts[j][i].x - mouse.x;
                    dy = parts[j][i].y - mouse.y;
                    sqrDist = Math.sqrt(dx * dx + dy * dy);



                    if (sqrDist < 40 && parts[j][i].c > 5) { // 색 죽여야하는데 어찌죽이는지 더 공부해보기
                        parts[j][i].c -= 16;
                        if (parts[j][i].c < 5) { parts[j][i].c = 0; } else if (parts[j][i].c > 0x100) { parts[j][i].c = 0x99; }
                    }

                    if (itercount[j] == 1) { // 거리가 20 이내면 튕겨나가기 시작
                        parts[j][i].r = true;
                    }
                    if (itercount[j] == itertot) {
                        //parts[j][i].r = false;
                    }

                    //픽셀로 정리해서 움직임 표현하는부분 위치 업데이트 받는부분
                    parts[j][i].x3 = Math.floor(parts[j][i].x2 / denseness) * denseness;
                    parts[j][i].y3 = Math.floor(parts[j][i].y2 / denseness) * denseness;

                    //Draw the 박스
                    if (parts[j][i].c > 10) {
                        context.fillStyle = '#' + (parts[j][i].c * 0x10101).toString(16);
                    } else { context.fillStyle = '#000000' }
                    context.beginPath();
                    context.fillRect(parts[j][i].x3, parts[j][i].y3, denseness, denseness);

                    context.closePath();
                    //context.fillRect(x, y, width, height)
                    context.fill();
                    if (itercount[j] == 0) {
                        parts[j][i].r = false;
                    }
                }
            }
        }

        //make mouse cursor
        /*
        if (mouseClickCount % 2 == 0) {
            context.fillStyle = '#ffff00';
        } else { context.fillStyle = '#ff0000' }
        context.beginPath();
        context.fillRect(mouse.x, mouse.y, 10, 10);
        context.closePath();
        */



        var sinPoint = Math.sin(remap(mouse.x, 0, canvas.width, 0, Math.PI));
        sinPoint = sinPoint * 30 + 10;


        drawString(context, "click to visit", mouse.x - 100, mouse.y, '#000', 0, "Spoqa Han Sans", sinPoint);
        var windowHeight = 0;
        var windowWidth = 0;
        if (mouseClickCount <= 2) { // 2가 초기값임.
            windowWidth = 1000; //작은화면
            windowHeight = 600;
        } else if (mouseClickCount == 3) {
            windowWidth = canvas.width;
            windowHeight = canvas.height / 2;
        } //큰화면
        else {
            windowWidth = (canvas.width - 500) + Math.sin(remap(mouse.x, 0, canvas.width, 0, Math.PI)) * 300;
            windowHeight = (canvas.height / 2 - 500) + Math.random() * 500;
        } //랜덤화면


        var xPos = canvas.width / 2 - windowWidth / 2;
        var yPos = canvas.height / 4 - windowHeight / 2;

        if (saveMouseCount == mouseClickCount) {
            //$window = window.close();
            $window = window.open("invisible.html", "invisible", "width=" +
                windowWidth + ",height=" + windowHeight + ",left=" + xPos + ",top=" + yPos);

            saveMouseCount++;
        }

    }



    var MouseMove = function(e) {
        if (e.layerX || e.layerX == 0) {
            //Reset particle positions
            mouseOnScreen = true;

            mouse.x = e.layerX - canvas.offsetLeft;
            mouse.y = e.layerY - canvas.offsetTop;
        }
    }

    var MouseOut = function(e) {
        mouseOnScreen = false;
        mouse.x = -100;
        mouse.y = -100;
    }

    var Click = function(e) {
        mouseClickCount++;
    }

    var remap = function(from, fromMin, fromMax, toMin, toMax) {
        var fromAbs = from - fromMin;
        var fromMaxAbs = fromMax - fromMin;

        var normal = fromAbs / fromMaxAbs;

        var toMaxAbs = toMax - toMin;
        var toAbs = toMaxAbs * normal;

        var to = toAbs + toMin;

        return to;
    }

    //Clear the on screen canvas




}
window.onresize = function() { location.reload(); }

var banner = new Banner();
banner.initialize("canvas");