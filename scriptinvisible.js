/*정리타임!!
1. 코드 파악
2. 구조변경(하고자 하는 바)
	1. 한줄씩 작성됨. 클릭할때마다 한줄 씩 생성. 글 생성시 전체 열을 읽고 폭을 계산해서 줄바꿈을 시전해야함. 줄바꿈된 대상부터 따로 저장되어서 카운팅을 해야겠다. 
		1. 마우스 몇번 눌렸는지! 그거랑 줄바꿈수랑 일치하는 지점에서 넘기는것으로!!
        2. 움직임을 지정픽셀 기준으로 바꿈
        3. 줄씩 생성되게끔 이중배열 지정
        4. 이중배열을 클릭시 나타나게 바꿈
            목표코드
            1. 코드가 지정 위치에서 시작하게 만듦.
            2. 클릭시 문장이 하나씩 생성
            3. 문장이 시작하면 문장에 딸린 카운트가 올라가면서 프로그램이 진행됨.
            4. :목표지점까지 이동함. 목표 지점은 랜덤으로 주변 10 픽셀 이내로 움직이거나 말거나임
        
            지금코드
            1. 시간이 지나면서 목표한 시간까지 달려감.
            2. 목표한 시간에 맞춰 글씨가 완성됨
            3. 목표한 시간 이후 새로운 조건이 되면 폭발함

    2. 일단 배경에다가 노이즈 까는 것 부터!
    
	3. 작성되고 서서히 색이 바뀜. 색이 바뀔 대상은 미리 지정해?? 지정하자??
		alt 1. 먼저 지정한 대상만 점점 어두워지면서 그게됨.
        alt 2. 몇번에 걸쳐서 작은 비율씩 죽여버림. 이거 랜덤을 뽑는 방식으로 진행해도 될듯.
        
    TODO: 4.글리치 추가하기
    
    마우스 인터렉션 고민
    뭐가 있을까?
    1. 클릭시 새로운 픽셀들이 생성
    2. 움직움직이게 하기.

    + 마우스 모양 바꾸기.
    어떻게?
    마우스를 누르면 바꾸기할까? 뿌리기 느낌으로?
    

    페이지 추가하기.
    메인페이지에서 연결가능하게?
    그것도 나쁘지 않을듯.

    나머지 페이지는 어쩌지? 추가할때 밑으로 넘길까?
    
*/


function Banner() {

    var keyword = "도시와 죽은 자들4\n\n아르지아가 다른 도시들과 다른 점은 공기 대신 그 자리를 흙이 차지하고\n있다는 겁니다. 길들은 완전히 흙에 묻혀있고 방은 천장까지 진흙으로\n차 있으며 계단에는 다른 계단이 반대로 놓여있고 지층이 먹구름 낀\n하늘처럼 무겁게 지붕을 짓누르고 있습니다. 주민들이 지렁이 같은 좁은\n터널과 뿌리가 이리저리 뻗어나가며 생긴 좁은 틈을 넓혀가며 시내를\n돌아다니는지 어떤지는 우리가 알 수 없습니다. 습기가 인간의 몸을\n망가뜨리고 기운을 빼앗아 가버립니다. 어둡기 때문에 가만히 누워있는 \n것이 좋을 겁니다.\n\n위에서 보면 아르지아는 전혀 보이지 않습니다.\" 저 흙 밑에 있다.\" 라고 \n말하는 사람이 있기 때문에 그걸 믿는 도리밖에 없습니다. 그곳은 사막\n처럼 황량합니다. 밤에 땅에 귀를 가까이 갖다대면 가끔 문을 꽝 닫는 \n소리가 들립니다."; // 맨트 길어지면 문제가 생김
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
    var fontSizeis_to = 28;
    var fontSizeis;
    var canvas;
    var context;
    var state = 0;
    var startEaster = false;

    var start_xpt = 100; // FIXME: 시점좌표, 이것도 비율로 할 필요가 있음
    var start_ypt = 150;

    var movingRat = 0.5;
    var darkenRat = 0.4; //어두운 비율



    var lines;
    var reuptext = 10; // 텍스트 위로 올리는 라인

    var canclose = false;

    var bgCanvas;
    var bgContext;

    var denseness = 2; //픽셀사이즈와 간격

    //Each particle/icon
    var parts = [];

    var mouse = { x: -100, y: -100 };
    var mouseOnScreen = false;
    var mouseClickCount = 0;

    var itercount = [];
    var itertot = 50; // 300; // 속도와 관련

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


        context.fillStyle = '#000'; //배경색 설정
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

        if (Math.random() < movingRat) {
            if (Math.random() < darkenRat) { // 해당 확률의 경우 움직임
                parts[idx].push({ // 숫자가 높을수록 밝음. 나누기를 해줘야겠군.
                    c: Math.floor(Math.random() * 0x100), //(Math.floor(Math.random() * 0x100) * 0x10101).toString()
                    cc: true,
                    x: startx, //goal position
                    y: starty,
                    x2: x, //start position
                    y2: y,
                    x3: x,
                    y3: y,
                    easter: 0,
                    count: 0,
                    r: true, //Released (to fly free!)
                    v: { x: velx, y: vely } //속도인가봐..
                })
            } else {
                parts[idx].push({
                    c: Math.floor(Math.random() * 0x100),
                    cc: false,
                    x: startx, //goal position
                    y: starty,
                    x2: x, //start position
                    y2: y,
                    x3: x,
                    y3: y,
                    easter: 0,
                    count: 0,
                    r: true, //Released (to fly free!)
                    v: { x: velx, y: vely } //속도인가봐..
                })
            }

        } else {
            if (Math.random() < darkenRat) { // 해당 확률의 경우 움직임
                parts[idx].push({ // 숫자가 높을수록 밝음. 나누기를 해줘야겠군.
                    c: Math.floor(Math.random() * 0x100), //(Math.floor(Math.random() * 0x100) * 0x10101).toString()
                    cc: true,
                    x: startx, //goal position
                    y: starty,
                    x2: x, //start position
                    y2: y,
                    x3: x,
                    y3: y,
                    easter: 0,
                    count: 0,
                    r: true, //Released (to fly free!)
                    v: { x: 0, y: 0 } //속도인가봐..
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
                    easter: 0,
                    count: 0,
                    r: true, //Released (to fly free!)
                    v: { x: 0, y: 0 } //속도인가봐..
                })
            }
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


                    //마우스와 각 점의 거리
                    dx = parts[j][i].x - mouse.x;
                    dy = parts[j][i].y - mouse.y;
                    sqrDist = Math.sqrt(dx * dx + dy * dy);

                    //If the dot has been released
                    if (parts[j][i].r == true) { // 움직이는중이면

                        //이스터 2 + 거리가 가까우면 >> 이스터 3 
                        if (sqrDist < 200 && parts[j][i].easter == 2) {
                            parts[j][i].v = { x: (mouse.x - parts[j][i].x) * 0.1, y: (mouse.y - parts[j][i].y) * 0.1 };
                            //parts[j][i].easter = 3;
                        }

                        //이스터 3 >> 마우스 인터렉션
                        //if (mouseClickCount > 30) {
                        //parts[j][i].v = { x: (mouse.x - parts[j][i].x) * 0.1, y: (mouse.y - parts[j][i].y) * 0.1 };
                        //}




                        //Fly into infinity!!
                        parts[j][i].x2 += parts[j][i].v.x; // 속도가 더해지는 시점.
                        parts[j][i].y2 += parts[j][i].v.y;
                        /*

                        if (parts[j][i].x2 < 0) { parts[j][i].r = false; }
                        if (parts[j][i].x2 > canvas.width) { parts[j][i].r = false; }
                        if (parts[j][i].y2 < 0) { parts[j][i].r = false; }
                        if (parts[j][i].y2 > canvas.height / 2) { parts[j][i].r = false; }
                        */

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


                    //이스터 1 >> r이 죽고, 이스터가 1이 되면 다시 움직인다.
                    if (parts[j][i].r == false && parts[j][i].easter == 1) { //종료되는 시점 속도 재설정, 
                        parts[j][i].v = { x: (Math.random() * 10) * 2 - 10, y: (Math.random() * 10) * 2 - 10 };

                        parts[j][i].easter = 2;
                        parts[j][i].r = true;
                    }




                    //마우스와 각 점의 거리
                    dx = parts[j][i].x - mouse.x;
                    dy = parts[j][i].y - mouse.y;
                    sqrDist = Math.sqrt(dx * dx + dy * dy);



                    if (sqrDist < 40 && parts[j][i].c > 5) { // 색 죽여야하는데 어찌죽이는지 더 공부해보기
                        if (!startEaster) { // 색 죽이는거 이스터에그 시작하면 안함.
                            parts[j][i].c -= 16;
                            if (parts[j][i].c < 5) { parts[j][i].c = 0; } else if (parts[j][i].c > 0x100) { parts[j][i].c = 0x99; }
                        }
                    }

                    if (itercount[j] == itertot / 10) { // 거리가 20 이내면 튕겨나가기 시작
                        parts[j][i].r = true;
                    }
                    if (itercount[j] == itertot) {
                        parts[j][i].r = false;
                    }
                    // 마지막 인터렉션이 끝날때!>>이스터스타터를 켜거나 완전 종료시키거나
                    if (itercount[lines.length - 1] == itertot && startEaster == false) {
                        if (Math.random() < 0.8) {
                            canclose = true;

                        } else {
                            startEaster = true;
                        }

                    }
                    if (startEaster) {
                        parts[j][i].easter = 1;
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
                        parts[lines.length][i].r = false;
                    }

                }
            }
        }

        /*/make mouse cursor
        if (mouseClickCount % 2 == 0) {
            context.fillStyle = '#ffff00';
        } else { context.fillStyle = '#ff0000' }
        context.beginPath();
        context.fillRect(mouse.x, mouse.y, 10, 10);
        context.closePath();
        */

        if (canclose == true) { self.close(); }





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

    //Clear the on screen canvas





}
window.onresize = function() { location.reload(); }

var banner = new Banner();
banner.initialize("canvas");