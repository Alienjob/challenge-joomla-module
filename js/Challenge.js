var sys;

function sysObject(){
    this.isNumber = function(n) {
      return !isNaN(parseInt(n)) && isFinite(n);
    };
    this.getRandomInt = function (min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    this.extend = function(Child, Parent) {

        var F = function() { };
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.superclass = Parent.prototype;

    };
}
 
function ChallengeManager() {
    
    this.challenges = {};
    this.userdata = {loged : false};
    
    function wsConnect(){
        /*if (!window.WebSocket) {
                document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
        }*/

        // создать подключение
        this.socket = new WebSocket("ws://localhost:8081");
        this.socket.onmessage = function(event) {
            var incomingMessage = event.data;
            beginMessage(incomingMessage); 
        };
    }
    
    function beginMessage(message){
        var pmessage = JSON.parse(message);
        if (pmessage.login !== undefined){
            window.challengeManager.userdata = pmessage.userdata;
            window.challengeManager.userdata.loged = true;
            if (pmessage.challenges !== undefined)
                for(var i in pmessage.challenges) {
                    if (!pmessage.challenges.hasOwnProperty(i)) continue;
                    if (window.challengeManager.challenges[i]){
                        window.challengeManager.challenges[i].answerVerifed(pmessage.challenges[i].result);
                        window.challengeManager.challenges[i].initQuestion(pmessage.challenges[i].question); 
                    }
            }

        }
        if (pmessage.challenge !== undefined){
            var id = pmessage.challenge;
            if (pmessage.result !== undefined)
            {
                window.challengeManager.challenges[id].answerVerifed(pmessage.result);
            }
            if (pmessage.question !== undefined)
            {
                window.challengeManager.challenges[id].initQuestion(pmessage.question);
            }
            if (pmessage.stat !== undefined)
            {
                window.challengeManager.challenges[id].stat = pmessage.stat;
            }
        }
        if (pmessage.log !== undefined){
            if (pmessage.challenge !== undefined)
                console.log(pmessage.challenge.toString() + pmessage.log);
            else
                console.log(pmessage.log);
        }
    
    }
    
    function wsSend(message){
        this.socket.send(JSON.stringify(message));
    }
    
    this.addChallenge = function(name){
        var id = Math.random();
        var challenge = new Challenge(name, window.challengeManager, id);
        
        window.challengeManager.challenges[id] = challenge;
        return challenge;
    };
    this.ulogin = function(token){
        var result = {};
        for(var i in window.challengeManager.challenges) {
            if (!window.challengeManager.challenges.hasOwnProperty(i)) continue;
            result[i] = {challengeID : window.challengeManager.challenges[i].id, baseUID : window.challengeManager.challenges[i].baseID};
        }
        var outgoingMessage = {
            token : token,
            challenges : result
        };
        wsSend(outgoingMessage)
    }

    this.saveResult = function(challenge, currentAnswer){
        if (window.challengeManager.userdata.loged === true){
            
            challenge.waitVerifyAnswer();
            var message = {stat : {
                    delay       : challenge.delay,
                    point       : challenge.bonus,
                    question    : challenge.question,
                    answer      : currentAnswer
                },
                challengeID : challenge.id
                };
            wsSend(message);
        
        }else{
            challenge.offlineVerifyAnswer(challenge.answer);
            challenge.question = challenge.getOfflineQuestion();
        }

    };
    this.refreshStat = function(challenge){
        if (window.challengeManager.userdata.loged === true){
            
            var message = {
                query :'getStat',
                challengeID : challenge.id
                };
            wsSend(message);
        
        }

    };
    
    wsConnect();
    
};
 
function ChallengeManagerMath() {
    
    ChallengeManagerMath.superclass.constructor.call(this);
    
    function getInitData(typeLimit){
        var firstOperandLimit;
        var secondOperandLimit;
        var operatorLimit;
        var baseID;
        
        if (typeLimit === 'minus789')        {
            baseID = 1;
            firstOperandLimit = ({MIN : 100, MAX : 1000});
            secondOperandLimit = ({MIN : 7, MAX : 9});
            operatorLimit = '-';
        }
        if (typeLimit === 'multiply9')        {
            baseID = 2;
            firstOperandLimit = ({MIN : 10, MAX : 100});
            secondOperandLimit = ({MIN : 9, MAX : 9});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiply2')        {
            baseID = 3;
            firstOperandLimit = ({MIN : 100, MAX : 10000});
            secondOperandLimit = ({MIN : 2, MAX : 2});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiply4')        {
            baseID = 4;
            firstOperandLimit = ({MIN : 100, MAX : 5000});
            secondOperandLimit = ({MIN : 4, MAX : 4});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiply8')        {
            baseID = 5;
            firstOperandLimit = ({MIN : 100, MAX : 1000});
            secondOperandLimit = ({MIN : 8, MAX : 8});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiply5')        {
            baseID = 6;
            firstOperandLimit = ({MIN : 100, MAX : 1000, DIVISIBLE : 2});
            secondOperandLimit = ({MIN : 5, MAX : 5});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiply25')        {
            baseID = 7;
            firstOperandLimit = ({MIN : 100, MAX : 1000, DIVISIBLE : 4});
            secondOperandLimit = ({MIN : 25, MAX : 25});
            operatorLimit = '*';
        }
        if (typeLimit === 'division2')        {
            baseID = 8;
            firstOperandLimit = ({MIN : 1, MAX : 10000, DIVISIBLE : 2});
            secondOperandLimit = ({MIN : 2, MAX : 2});
            operatorLimit = '/';
        }
        if (typeLimit === 'division4')        {
            baseID = 9;
            firstOperandLimit = ({MIN : 100, MAX : 5000, DIVISIBLE : 4});
            secondOperandLimit = ({MIN : 4, MAX : 4});
            operatorLimit = '/';
        }
        if (typeLimit === 'division8')        {
            baseID = 10;
            firstOperandLimit = ({MIN : 100, MAX : 1000, DIVISIBLE : 8});
            secondOperandLimit = ({MIN : 8, MAX : 8});
            operatorLimit = '/';
        }
        if (typeLimit === 'multiply19')        {
            baseID = 11;
            firstOperandLimit = ({MIN : 100, MAX : 1000});
            secondOperandLimit = ({MIN : 1, MAX : 9});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiplyXX')        {
            baseID = 12;
            firstOperandLimit = ({MIN : 20, MAX : 100});
            secondOperandLimit = ({MIN : 20, MAX : 100});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiply11')        {
            baseID = 13;
            firstOperandLimit = ({MIN : 20, MAX : 100});
            secondOperandLimit = ({MIN : 11, MAX : 11});
            operatorLimit = '*';
        }
        if (typeLimit === 'multiplyXXX11')        {
            baseID = 14;
            firstOperandLimit = ({MIN : 200, MAX : 1000});
            secondOperandLimit = ({MIN : 11, MAX : 11});
            operatorLimit = '*';
        }
        if (typeLimit === 'squareX')        {
            baseID = 15;
            firstOperandLimit = ({MIN : 2, MAX : 9});
            secondOperandLimit = ({MIN : 2, MAX : 2});
            operatorLimit = '^';
        }
        if (typeLimit === 'squareXX')        {
            baseID = 16;
            firstOperandLimit = ({MIN : 10, MAX : 99});
            secondOperandLimit = ({MIN : 2, MAX : 2});
            operatorLimit = '^';
        }
        if (typeLimit === 'squareXXX')        {
            baseID = 17;
            firstOperandLimit = ({MIN : 100, MAX : 999});
            secondOperandLimit = ({MIN : 2, MAX : 2});
            operatorLimit = '^';
        }
        if (typeLimit === 'squareX5')        {
            baseID = 18;
            firstOperandLimit = ({MIN : 1, MAX : 9, SUFFIX : 5});
            secondOperandLimit = ({MIN : 2, MAX : 2});
            operatorLimit = '^';
        }
        return ({firstOperandLimit : firstOperandLimit, secondOperandLimit:secondOperandLimit, operatorLimit:operatorLimit, baseID : baseID});
    }
    
    this.addChallenge = function(name, initData){
        var id = Math.random();
        var challenge = new ChallengeMath(name, window.challengeManager, id, initData);
        challenge.question = challenge.getOfflineQuestion();
        window.challengeManager.challenges[id] = challenge;
        return challenge;
    };
    this.InitData = {
    minus789 : getInitData('minus789'),
    multiply9 : getInitData('multiply9'),
    multiply2 : getInitData('multiply2'),
    multiply4 : getInitData('multiply4'),
    multiply8 : getInitData('multiply8'),
    multiply5 : getInitData('multiply5'),
    multiply25 : getInitData('multiply25'),
    division2 : getInitData('division2'),
    division4 : getInitData('division4'),
    multiply19 : getInitData('multiply19'),
    multiplyXX : getInitData('multiplyXX'),
    multiply11 : getInitData('multiply11'),
    multiplyXXX11 : getInitData('multiplyXXX11'),
    squareX : getInitData('squareX'),
    squareXX : getInitData('squareXX'),
    squareXXX : getInitData('squareXXX'),
    squareX5 : getInitData('squareX5')
    };
    
};

function Challenge(name, manager, id) {
    
    this.states = {neytral : "neitral", win : "win", lose:"lose", blocked : "blocked"};
    
    this.id = id;
    this.baseID = 0;
    this.name = name;
    this.manager = manager;
    this.minimize = false;
    this.showhelp = false;
    this.showstat = false;

    this.verifyAnswer = function(currentAnswer){
        if (currentAnswer !== "")
            window.challengeManager.saveResult(this, currentAnswer);
        
    };
    this.offlineVerifyAnswer = function(currentAnswer){
        
        var currentTime = new Date();
        this.delay = currentTime - this.lastTime;
        
        var rightAnswer = this.question.calculate().toString();
        this.oldQuestion = this.question.toString() + " = " + rightAnswer + ". Ваш ответ: " + currentAnswer;
        
        if (rightAnswer === currentAnswer){
            this.lastTime = currentTime;
            this.state = this.states.win;
            if (this.delay < this.delayLimit)
                this.level += 1;
            else
                this.level = 0;
            this.bonus = 1 + this.level * 2; 
            this.score += this.bonus;

        }else{
            this.lastTime = -1;
            this.state = this.states.lose;
            this.level = 0;
            this.bonus = 0;
        }

        if (this.score >= 100)
            this.state = this.states.blocked;
        
        this.answer = "";
        
    };
    this.waitVerifyAnswer = function(){
        
        this.state = this.states.blocked;
        this.answer = "";
        
    };
    this.answerVerifed = function(result){
        
        if (result.right){
            this.state = this.states.win;
            this.lastTime = new Date();
            this.bonus = result.bonus; 
            this.score = result.score;
        }else{
            this.lastTime = -1;
            this.state = this.states.lose;
            this.level = 0;
            this.bonus = 0; 
        }
        if (result.blocked){
            this.state = this.states.blocked;
        }
        this.oldQuestion = result.oldQuestion;
        this.level = result.level;
        
    };
    this.getOfflineQuestion = function(){
        function expression(){
            this.toString = function(){ return "Введите А"};          
            this.calculate = function(){ return "A"};          
        }
        return new expression();
    };
    this.refreshStat = function(){
        window.challengeManager.refreshStat(this);
    }
    
    this.state = this.states.neytral;
    this.question = this.getOfflineQuestion();
    this.answer = "";
    this.oldQuestion = "Здесь будет показан предыдущий вопрос";
    this.lastTime = -1;
    this.delayLimit = 30000;
    this.level = 0;
    this.score = 0;
    this.bonus = 0; 
    this.delay = 1000000;
    
    this.stat = [];
    
}

function ChallengeMath(name, manager, id, initData){
    
    this.initData = initData;
    
    ChallengeMath.superclass.constructor.call(this, name, manager, id);

    this.baseID = initData.baseID;

    //древовидная структура мат. выражения
    function expression(inFirstOperand, inSecondOperand, inOperator) {
        this.firstOperand = inFirstOperand;
        this.secondOperand = inSecondOperand;
        this.operator = inOperator;
        
        this.toString = function(){
            
          return this.firstOperand.toString() + ' ' + this.operator + ' ' + this.secondOperand.toString();
          
        };
        this.calculate = function(){
            var o1 = 0;
            var o2 = 0;
            
            if ( sys.isNumber(this.firstOperand))
                o1 = parseInt(this.firstOperand);
            else 
                o1 = this.firstOperand.calculate();
            
            if ( sys.isNumber(this.secondOperand))
                o2 = parseInt(this.secondOperand);
            else 
                o2 = this.secondOperand.calculate();
            
            if (this.operator === '+')
                return o1 + o2;
            if (this.operator === '*')
                return o1 * o2;
            if (this.operator === '-')
                return o1 - o2;
            if (this.operator === '/')
                return Math.floor(o1 / o2);
            if (this.operator === '^')
                return Math.pow(o1, o2);
            
        };
        
    };
    function getPrimitiveQuestion(firstOperandLimit, secondOperandLimit, operatorLimit){
        
        //firstOperandLimit ограничение на первый операнд. Структура из минимального и максимального значения. {MIN: x, MAX: X} 
        //secondOperandLimit ограничение на второй операнд. Структура из минимального и максимального значения. {MIN: x, MAX: X}
        //Можно указать обязательную кратность - DIVISIBLE
        //Можно указать цифры, которые будут дописаны к операнду - SUFFIX
        //operationLimit ограничение на оператор. Строка допустимых операторов "+-*/^!"
        
        var firstOperand = sys.getRandomInt(firstOperandLimit.MIN, firstOperandLimit.MAX);
        var secondOperand = sys.getRandomInt(secondOperandLimit.MIN, secondOperandLimit.MAX);
        var indexOperator = sys.getRandomInt(1, 120)%operatorLimit.length;
        var operator = operatorLimit[indexOperator];
        
        if (firstOperandLimit.DIVISIBLE !== undefined){
            firstOperand = firstOperand - firstOperand % firstOperandLimit.DIVISIBLE;
        }
        if (secondOperandLimit.DIVISIBLE !== undefined){
            secondOperand = secondOperand - secondOperand % secondOperandLimit.DIVISIBLE;
        }

        if (firstOperandLimit.SUFFIX !== undefined){
            firstOperand = +(firstOperand.toString() + firstOperandLimit.SUFFIX.toString());
        }
        if (secondOperandLimit.SUFFIX !== undefined){
            secondOperand = +(secondOperand.toString() + secondOperandLimit.SUFFIX.toString());
        }
        
        return new expression(firstOperand, secondOperand, operator);
        
    };
    this.getOfflineQuestion = function(){
        
        if (this.initData === undefined)
        {
            var firstOperandLimit = ({MIN : 1, MAX : getRandomInt(5, 1000)});
            var secondOperandLimit = ({MIN : 1, MAX : getRandomInt(5, 1000)});
            var operatorLimit = '+-*/';
            
            this.initData = ({firstOperandLimit : firstOperandLimit, secondOperandLimit:secondOperandLimit, operatorLimit:operatorLimit});
        }
        
        return  getPrimitiveQuestion(this.initData.firstOperandLimit, this.initData.secondOperandLimit, this.initData.operatorLimit);
        

    };
    this.initQuestion = function(questionData){
        this.question = new expression(questionData.firstOperand, questionData.secondOperand, questionData.operator);
    }
}

sys = new sysObject();
sys.extend(ChallengeManagerMath, ChallengeManager);
sys.extend(ChallengeMath, Challenge);


var states = {neytral : "neitral", win : "win", lose:"lose", blocked : "blocked"}

var defaultData = {
    name : "Упражнение",    //заголовок упражнения
    state:0,                //статус - 0- нейтрально, 1- положительно, 2- отрицательно, 3 - заблокировано
    lastTime : -1,          //время последенго верного ответа. Если <0 то либо ответа не было либо он не верен
    level : 0,              //уровень набранного комбо. от 0 до 10
    score: 0,               //набранные очки
    question:"Вопрос",      //Строка вопроса
    oldQuestion:"Прошлый вопрос", //Строка описывающая предыдущий вопрос
    delayLimit: 30,          //время на ответ до сброса комбо
    answer: ""              //текст ответа пользователя
    
};


var panel = ReactBootstrap.Panel;
var ProgressBar = ReactBootstrap.ProgressBar;
var Button = ReactBootstrap.Button;
var Glyphicon = ReactBootstrap.Glyphicon;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Input = ReactBootstrap.Input;
var Well  = ReactBootstrap.Well;
var OverlayTrigger  = ReactBootstrap.OverlayTrigger;
var Modal  = ReactBootstrap.Modal;
var ModalTrigger  = ReactBootstrap.ModalTrigger;
var Label = ReactBootstrap.Label;

//ChallengeContainer
var rChallengeContainer = React.createClass({displayName: 'rChallengeContainer', 
    
    challenge : {},
    share42: function(){
        var e=document.getElementById('share42init');
        if(e){
        if(e.getAttribute('data-url')!=-1)var u=e.getAttribute('data-url');
        if(e.getAttribute('data-title')!=-1)var t=e.getAttribute('data-title');
        if(e.getAttribute('data-image')!=-1)var i=e.getAttribute('data-image');
        if(e.getAttribute('data-description')!=-1)var d=e.getAttribute('data-description');
        if(e.getAttribute('data-path')!=-1)var f=e.getAttribute('data-path');
        if(e.getAttribute('data-icons-file')!=-1)var fn=e.getAttribute('data-icons-file');
        if(!f){
            function path(name){
                var sc=document.getElementsByTagName('script'),sr=new RegExp('^(.*/|)('+name+')([#?]|$)');
                for(var p=0,scL=sc.length;p<scL;p++){
                    var m=String(sc[p].src).match(sr);
                    if(m){
                        if(m[1].match(/^((https?|file)\:\/{2,}|\w:[\/\\])/)){
                            return m[1];
                        }
                        if(m[1].indexOf("/")==0){
                            return m[1];
                        }
                        b=document.getElementsByTagName('base');
                        if(b[0]&&b[0].href){
                           return b[0].href+m[1];
                       }else{
                            return document.location.pathname.match(/(.*[\/\\])/)[0]+m[1];
                        }
                    }
                }
                return null;
                }
                f=path('share42.js');
            }
            if(!u)u=location.href;if(!t)t=document.title;
            if(!fn)fn='icons.png';
            function desc(){var meta=document.getElementsByTagName('meta');for(var m=0;m<meta.length;m++){
                    if(meta[m].name.toLowerCase()=='description'){
                        return meta[m].content;}}return'';
            }

            if(!d)d=desc();
            u=encodeURIComponent(u);
            t=encodeURIComponent(t);
            t=t.replace(/\'/g,'%27');
            i=encodeURIComponent(i);
            d=encodeURIComponent(d);
            d=d.replace(/\'/g,'%27');
            var fbQuery='u='+u;if(i!='null'&&i!='')fbQuery='s=100&p[url]='+u+'&p[title]='+t+'&p[summary]='+d+'&p[images][0]='+i;var vkImage='';
            if(i!='null'&&i!='')vkImage='&image='+i;
            var s=new Array('"#" data-count="fb" onclick="window.open(\'http://www.facebook.com/sharer.php?m2w&'+fbQuery+'\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="���������� � Facebook"','"#" data-count="lnkd" onclick="window.open(\'http://www.linkedin.com/shareArticle?mini=true&url='+u+'&title='+t+'\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=600, height=400, toolbar=0, status=0\');return false" title="�������� � Linkedin"','"#" data-count="odkl" onclick="window.open(\'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st._surl='+u+'&title='+t+'\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="�������� � �������������"','"#" data-count="twi" onclick="window.open(\'https://twitter.com/intent/tweet?text='+t+'&url='+u+'\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="�������� � Twitter"','"#" data-count="vk" onclick="window.open(\'http://vk.com/share.php?url='+u+'&title='+t+vkImage+'&description='+d+'\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="���������� � ��������"');var l='';for(j=0;j<s.length;j++)l+='<a rel="nofollow" style="display:inline-block;vertical-align:bottom;width:32px;height:32px;margin:0 6px 6px 0;padding:0;outline:none;background:url('+f+fn+') -'+32*j+'px 0 no-repeat" href='+s[j]+' target="_blank"></a>';
            e.innerHTML='<span id="share42">'+l+'</span>';
        }
    },
    
    tick: function() {
        if (this.flagTick === true)
        {
            clearInterval(this.interval);
            this.interval = setInterval(this.tick, 1000)
            this.flagTick = false;
        }
        if ((!this.challenge.minimize) 
                && (!this.challenge.showhelp) 
                && (!this.challenge.showstat)
                && (!this.challenge.showlogin)
                && (!this.challenge.showsocial)
                )
            this.refs.scoreContainer.refs.comboContainer.initState(this.challenge.lastTime, this.challenge.level);

        if (this.challenge.showsocial) 
            this.share42();
        
        this.setState({
            cState: this.challenge
        });
    },
    getInitialState: function() {
        return {
            cState  :   this.props.data
        };
    },
    handleUserInput: function(answerText) {
        this.challenge.answer = answerText;
        this.setState({
            cState: this.challenge
        });
    },
    onUserKeyPress: function(intKey) {
        if ( intKey === 13 ){
            this.challenge.verifyAnswer(this.challenge.answer);
            this.setState({
                cState: this.challenge
            });
            this.refs.scoreContainer.refs.comboContainer.initState(this.challenge.lastTime, this.challenge.level);

            clearInterval(this.interval);
            this.interval = setInterval(this.tick, 200);
            this.flagTick = true;
        }
    },
    minimize: function(){
        this.challenge.minimize = !(this.challenge.minimize);
        this.setState({
            cState: this.challenge
        });
    },
    showhelp: function(){
        if (this.challenge.showhelp){
            this.challenge.showhelp = false;
        }else{
            this.challenge.showhelp = true;
            this.challenge.showstat = false;
            this.challenge.showlogin = false;
            this.challenge.showsocial = false;
        }
        
        this.setState({
            cState: this.challenge
        });
    },
    showstat: function(){
        this.challenge.refreshStat();
        if (this.challenge.showstat){
            this.challenge.showstat = false;
        }else{
            this.challenge.showstat = true;
            this.challenge.showhelp = false;
            this.challenge.showlogin = false;
            this.challenge.showsocial = false;
        }
        
        this.setState({
            cState: this.challenge
        });
    },
    showlogin: function(){
        this.challenge.refreshStat();
        if (this.challenge.showlogin){
            this.challenge.showlogin = false;
        }else{
            this.challenge.showlogin = true;
            this.challenge.showhelp = false;
            this.challenge.showstat = false;
            this.challenge.showsocial = false;
        }
        
        this.setState({
            cState: this.challenge
        });
    },
    showsocial: function(){
        this.challenge.refreshStat();
        if (this.challenge.showsocial){
            this.challenge.showsocial = false;
        }else{
            this.challenge.showsocial = true;
            this.challenge.showhelp = false;
            this.challenge.showlogin = false;
            this.challenge.showstat = false;
        }
        
        this.setState({
            cState: this.challenge
        });
        this.flagTick = true;
    },
    
    render: function() {
    
    this.challenge = this.props.data;

    clearInterval(this.interval);
    this.interval = setInterval(this.tick, 1000)
    this.flagTick = false;

    var className = "ChallengeContainer";
    if (this.state.cState.state === this.challenge.states.win)
        className = "ChallengeContainerWin";
    if (this.state.cState.state === this.challenge.states.lose)
        className = "ChallengeContainerLose";
    if (this.state.cState.state === this.challenge.states.blocked)
        className = "ChallengeContainerBlocked";
    var scoreData = {minimize : this.state.cState.minimize, lastTime : this.state.cState.lastTime, delayLimit : this.state.cState.delayLimit, level : this.state.cState.level, score : this.state.cState.score};
    if (this.state.cState.showlogin){
        return (
        panel({className: className}, 
          rChallengeHeader({data: {name : this.state.cState.name, loged : window.challengeManager.userdata.loged}, minimize: this.minimize, showhelp: this.showhelp, showstat: this.showstat, showlogin: this.showlogin, showsocial: this.showsocial}), 
            rLogin(null)
        )
        );
    }
    if (this.state.cState.showsocial){
        //jQuery(window).on("load",  this.share42);

        return (
        panel({className: className}, 
          rChallengeHeader({data: {name : this.state.cState.name, loged : window.challengeManager.userdata.loged}, minimize: this.minimize, showhelp: this.showhelp, showstat: this.showstat, showlogin: this.showlogin, showsocial: this.showsocial}), 
            rSocial({data: {name : this.state.cState.name, score : this.state.cState.score}})
        )
        );
    }
    if (this.state.cState.showhelp){
        return (
        panel({className: className}, 
          rChallengeHeader({data: {name : this.state.cState.name, loged : window.challengeManager.userdata.loged}, minimize: this.minimize, showhelp: this.showhelp, showstat: this.showstat, showlogin: this.showlogin, showsocial: this.showsocial}), 
            rChallengeHelpText(null)
        )
        );
    }
    if (this.state.cState.showstat) 
    {
        var data =  [['day', 'point']];
        for(var i in this.state.cState.stat) {
            data.push([this.state.cState.stat[i].day + '' ,this.state.cState.stat[i].point]);
        }
        return (
        panel({className: className}, 
          rChallengeHeader({data: {name : this.state.cState.name, loged : window.challengeManager.userdata.loged}, minimize: this.minimize, showhelp: this.showhelp, showstat: this.showstat, showlogin: this.showlogin, showsocial: this.showsocial}), 
            rChallengeShowStat({data: data})
        )
        );
    }
    return (
        panel({className: className}, 
          rChallengeHeader({data: {name : this.state.cState.name, loged : window.challengeManager.userdata.loged}, minimize: this.minimize, showhelp: this.showhelp, showstat: this.showstat, showlogin: this.showlogin, showsocial: this.showsocial}), 
          rChallengeScoreContainer({ref: "scoreContainer", data: scoreData}), 
          rChallengeQuestion({data: this.state.cState.question.toString()}), 
          rChallengeAnswer({data: this.state.cState.answer, onUserInput: this.handleUserInput, onUserKeyPress: this.onUserKeyPress}), 
          rChallengeOldQuestion({data: this.state.cState.oldQuestion})
        )
    );
  }
  });

//ChallengeHeader
var rChallengeHeader = React.createClass({displayName: 'rChallengeHeader',
  headerClick:function(){
    this.props.minimize();
  },
  render: function() {
    return (
      Well({bsSize: "small", className: "ChallengeHeader"}, 
      rChallengeName({data: this.props.data.name}), 
      ButtonToolbar(null, 
            rChallengeLogin({data: this.props.data.loged, onClick: this.props.showlogin}), 
            rChallengeStat({data: this.props.data.loged, onClick: this.props.showstat}), 
            rChallengeSocial({data: this.props.data.loged, onClick: this.props.showsocial}), 
            rChallengeMinimize({onClick: this.headerClick}), 
            rChallengeHelp({onClick: this.props.showhelp})
        
      )
      )
    );
  }
  });

//ChallengeScoreContainer
var rChallengeScoreContainer = React.createClass({displayName: 'rChallengeScoreContainer',
  render: function() {
    if (!this.props.data.minimize)  
        return (
          React.DOM.div({className: "ChallengeScoreContainer"}, 
            rChallengeComboContainer({ref: "comboContainer", data: {lastTime : this.props.data.lastTime, delayLimit : this.props.data.delayLimit, level : this.props.data.level}}), 
            rChallengeScore({data: this.props.data.score})
          )
        );
    else
        return (
          React.DOM.div({className: "ChallengeScoreContainer"}
          )
        );
        
  }
  });

//ChallengeComboContainer
var rChallengeComboContainer = React.createClass({displayName: 'rChallengeComboContainer',
  getInitialState: function() {
    return {slevel: 0, stime:100, sLastTime : -1};
  },
  initState : function(lastTime, level){
      var stime = 0;
      var slevel = 0;
      if (lastTime !==  this.state.sLastTime){
          if(lastTime === -1){
            clearInterval(this.interval);
            }
          else{
            stime = 100;
            slevel = level; 
            clearInterval(this.interval);
            this.interval = setInterval(this.tick, 1000)
            } 
        console.log("rChallengeComboContainer : initState " + JSON.stringify(this.state));
        this.setState({slevel: slevel, stime : stime, sLastTime : lastTime});
      }
  },
  tick: function() {
    var stime = this.state.stime;
    var slevel = this.state.slevel;
    if (stime > 0) {
        stime -= 1000 * 100/this.props.data.delayLimit;
    }else{
        stime  = 0;
        slevel = 0;
        clearInterval(this.interval);
    }
    this.setState({stime: stime, slevel : slevel, sLastTime : this.state.sLastTime});
  },
  render: function() {
    return (
      React.DOM.div({className: "ChallengeComboContainer"}, 
        rChallengeComboTime({data: this.state.stime}), 
        rChallengeComboLevel({data: this.state.slevel})
      )
    );
  }
  });

// ChallengeName
var rChallengeName = React.createClass({displayName: 'rChallengeName',
  render: function() {
    return (
      React.DOM.div({className: "ChallengeName"}, 
            React.DOM.h4(null, this.props.data)
      )
    );
  }
  });

//ChallengeLogin
var rLogin = React.createClass({displayName: 'rLogin',
  render: function() {
    return (
          React.DOM.div({className: "modal-body"}, 
            React.DOM.p(null, React.DOM.div({id: "uLogin", 'data-ulogin': "display=panel;fields=first_name,last_name;providers=vkontakte,odnoklassniki,mailru,facebook;hidden=other;redirect_uri=''; callback=callbackUlogin"}))
        )
      );
  }
});  
//ChallengeLogin
var rSocial = React.createClass({displayName: 'rSocial',
  render: function() {
    
    return (
          React.DOM.div({className: "modal-body"}, 
            React.DOM.div({id : "share42init",
                'data-url' : 'www.catacademy.ru',
                'data-title' : 'Win!',
                'data-description' : 'I collect ' + this.props.data.score + ' points in challenge ' + this.props.data.name + "! Let's try it!" 
            })
         )
        
      );
  }
});  

var rChallengeLogin = React.createClass({displayName: 'rChallengeLogin',
  render: function() {
    
    if (this.props.data === true)
        return (
          React.DOM.div({className: "ChallengeLogin"}
          )
        );
    else
    
        return (
          React.DOM.div({className: "ChallengeLogin"}, 
            Button({bsStyle: "default", onClick: this.props.onClick}, Glyphicon({glyph: "user"}))
          )
        );
  }
  });
  
//ChallengeSocial
var rChallengeSocial = React.createClass({displayName: 'rChallengeSocial',
  render: function() {
        return (
            React.DOM.div({className: "ChallengeSocial"}, 
              Button({onClick: this.props.onClick}, Glyphicon({glyph: "comment"}))
          )
        );
  }
  });

//ChallengeStat
var rChallengeStat = React.createClass({displayName: 'rChallengeStat',
  render: function() {
    if (this.props.data === false)
        return (
          React.DOM.div({className: "ChallengeStat"}
          )
            );
    else
        return (
          React.DOM.div({className: "ChallengeStat"}, 
              Button({ onClick: this.props.onClick}, Glyphicon({glyph: "signal"}))
          )
        );
  }
  });

var rChallengeMinimize = React.createClass({displayName: 'rChallengeMinimize',
  render: function() {
    return (
      React.DOM.div({className: "ChallengeMinimize"}, 
        Button({ onClick: this.props.onClick}, Glyphicon({glyph: "minus"}))
      )
    );
  }
 });

//ChallengeHelp
var rChallengeHelp = React.createClass({displayName: 'rChallengeHelp',
  render: function() {
    return (
      React.DOM.div({className: "ChallengeHelp"}, 
          Button({onClick: this.props.onClick}, "?")
      )
    );
  }
  });



//ChallengeComboTime
var rChallengeComboTime = React.createClass({displayName: 'rChallengeComboTime',
  render: function() {
   var cValue = 0;
    if(this.props.data !== undefined )
    {
        cValue =   this.props.data;
    }

     return (
      React.DOM.div({className: "ChallengeComboTime"}, 
        ProgressBar({bsStyle: "info", now: cValue})
      )
    );
  }
  });
  
//ChallengeComboLevel
var rChallengeComboLevel = React.createClass({displayName: 'rChallengeComboLevel',
  render: function() {
   var cValue = 0;
    if(this.props.data !== undefined )
        cValue  = this.props.data;
    return (
      React.DOM.div({className: "ChallengeComboLevel"}, 
        ProgressBar({bsStyle: "success", now: 10*cValue})
      )
    );
  }
  });
  
//ChallengeScore
var rChallengeScore = React.createClass({displayName: 'rChallengeScore',
  render: function() {
  var cValue = "Score : ";
    if(this.props.data !== undefined )
        cValue  += this.props.data;
     return (
      React.DOM.div({className: "ChallengeScore"}, 
          cValue
      )
    );
  }
  });



//ChallengeQuestion
var rChallengeQuestion = React.createClass({displayName: 'rChallengeQuestion',
  render: function() {
    var cValue = "Question";
    if(this.props.data !== undefined )
        cValue  = this.props.data;
    return (
      React.DOM.div({className: "ChallengeQuestion"}, 
        React.DOM.h3(null, cValue)
      )
    );
  }
  });

//ChallengeAnswer
var rChallengeAnswer = React.createClass({displayName: 'rChallengeAnswer',
    handleChange: function() {
        this.props.onUserInput(
            this.refs.filterTextInput.getDOMNode().value            
        );
    },
    getKeyCode: function(e) {
        var intKey = (window.Event) ? e.which : e.keyCode;
        this.props.onUserKeyPress(intKey);
    },
    componentDidMount: function() {
        this
            .getDOMNode()
            .offsetParent
            .addEventListener('keypress', this.getKeyCode);
    },
    
    render: function() {
        var cValue = "";
        if(this.props.data !== undefined )
            cValue  = this.props.data;
        return (
            React.DOM.div({className: "ChallengeAnswer"}, 
                React.DOM.input({
                    type: "text", 
                    value: cValue, 

                    ref: "filterTextInput", 
                    onChange: this.handleChange}
                    
                )
            )
        );
   }
  });

//ChallengeOldQuestion
var rChallengeOldQuestion = React.createClass({displayName: 'rChallengeOldQuestion',
  render: function() {
    var cValue = "Здесь будет показан предыдущий ответ";
    if(this.props.data !== undefined )
        cValue  = this.props.data;
     return (
      React.DOM.div({className: "ChallengeOldQuestion"}, 
        cValue
      )
    );
  }
  });

//ChallengeHelpText
var rChallengeHelpText = React.createClass({displayName: 'rChallengeHelpText',
  render: function() {
     return (
      React.DOM.div({className: "ChallengeHelpText"}, 
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня." + ' ' +
        "Если вам что-то непонятно - спросите меня"
      )
    );
  }
  });

//ChallengeShowStat
var rChallengeShowStat = React.createClass({displayName: 'rChallengeShowStat',
  render: function() {
     
     return (
      React.DOM.div({className: "ChallengeShowStat"}, 
        GoogleLineChart({data: this.props.data, graphName: "graphName"})
      )
    );
  }
  });

var GoogleLineChart = React.createClass({displayName: 'GoogleLineChart',
  render: function(){
    google.load("visualization", "1", {packages:["corechart"]});
    google.setOnLoadCallback(this.drawChart);
    return React.DOM.div({id: this.props.graphName, style: {height: "500px"}});
  },
  componentDidUpdate: function(){
    this.drawCharts();
  },
  drawCharts: function(){
    var data = google.visualization.arrayToDataTable(this.props.data);
    var options = {
      title: 'ABC',
    };
 
    var chart = new google.visualization.ColumnChart(
        document.getElementById(this.props.graphName)
    );
    chart.draw(data, options);
  }
});

window.renderChallenge = function(name, elementID, initData, challengeManager){
    var challenge = window.challengeManager.addChallenge(name, initData);
       for(var i in window.challengeManager.challenges) {
            if (!window.challengeManager.challenges.hasOwnProperty(i)) continue;
        }
    var that = this;
    
    var options = {
      dataType: "script",
      cache: true,
      url: "https://www.google.com/jsapi",
    };
    jQuery.ajax(options).done(function(){
      google.load("visualization", "1", {
        packages:["corechart"],
        callback: function() {
            React.renderComponent(
              rChallengeContainer({data: challenge}),
              document.getElementById(elementID)
            );
        }
      });
    }); 
};
      