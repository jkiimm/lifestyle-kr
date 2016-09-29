function remove(arr, idx) {
    return (idx<0 || idx>arr.length) ? arr : arr.slice(0, idx).concat(arr.slice(idx+1, arr.length));
};

var container;
var contIdx;

var tagStack=[];
var infoStack=[];
var margin = {
	top : 50,
	right : 50,
	bottom : 50,
	left : 50
};
var width = 850 - margin.left - margin.right;
var height = 490 - margin.top - margin.bottom;

var widthS=85;

var hS=[];
var wS=45;

var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var x2= d3.scale.ordinal().domain(["Midnight(00:00)", "3am(03:00)", "6am(06:00)", "9am(09:00)",
			"Noon(12:00)", "3pm(15:00)", "6pm(18:00)", "9am(21:00)", "Midnight(24:00)"]).rangePoints([0, width]);
var xAxis = d3.svg.axis().scale(x2).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".0%"));

var yAxisS=d3.svg.axis().scale(y).orient("right").tickFormat(d3.format(".0%"));

var format = d3.time.format("%H:%M");

var color = d3.scale.ordinal().range(
	["#95a0a5","#f19670","#ffd88d","#cc565f","#9163b6",
	"#4e2472","#65387d","#993767","#e279a3","#ca7c8c",
	"#e16552","#6ca8ba","#e2975d","#e9d78e","#e4bf80",
	"#8e8c6d","#74c493", "#447c69"]);

var contents={
    "title": [
        "Sleeping",
        "Eating and Drinking",
        "Personal Care",
        "Work",
        "Regular Education",
        "Irregular Education",
        "Household Activity",
        "Family Care",
        "Volunteering",
        "Socializing",
        "Ordinary person Education",
        "Media Use",
        "Religious Activity",
        "Cultural Event",
        "Sports",
        "Other Leisure",
        "Move",
        "Others"
    ],
    "subtitle": [
        "Sleep behavior",
        "Behavior that eat Food, meal or snack",
        "Behavior of managing health",
        "Productive work including paid or unpaid",
        "Activity of normal students at school",
        "Activity of normal students outside school",
        "Activities related to manage house",
        "Behavior that take care of their family",
        "Mandatory or voluntary activities",
        "Behavior that communicate other people",
        "Learning by the general public",
        "Behavior that use media",
        "Activities related to religion",
        "Participate Cultural event behavior",
        "Leisure and sports activities",
        "Behavior of other leisure time activities",
        "Move Behavior",
        "Blank, illegible hand and other behaviors"
    ],
    "contents": [
        "sleeping, napping, taking siesta, etc.",
        "eating with family or none family , eating alone,",
        "managing personal hygiene, beauty service,",
        "working, unpaid working, getting a break time,",
        "studying in school, getting a break time,",
        "listening lessons outside school,",
        "preparing food, managing house, cleaning,",
        "taking care of child, spouse, parents,",
        "helping neighborhood or acquaintances,",
        "associating by phone or internet,",
        "learning foreign language, Computer,",
        "reading newspaper, watching TV, video,",
        "personal religious activities,",
        "watching movie, drama, concert, sports,",
        "walking, hiking, climbing,",
        "reading, playing game, drinking,",
        null,
        null
    ],
    "contents2": [
        null,
        "eating snack, drinking etc.",
        "self-care, etc.",
        "house working, etc.",
        "shopping related to class, etc.",
        "self-studying outside school, etc.",
        "purchasing home-related stuff, etc.",
        "grand parents, etc.",
        "doing external activity, volunteering, etc.",
        "shopping related to fellowship , fighting, etc.",
        "learning for getting a job, etc.",
        "listening radio, browsing Internet, etc.",
        "participation in religious activities, etc.",
        "seeing exhibition, etc.",
        "strengthening of physical strength, driving, etc.",
        "going karaoke, smoking, doing nothing, etc.",
        null,
        null
    ]
};


var area = d3.svg.area().x(function(d) {
	return x(d.time);
}).y0(function(d) {
	return y(d.y0);
}).y1(function(d) {
	return y(d.y0 + d.y);
});

var stack = d3.layout.stack().values(function(d) {
	return d.values;
});

	
var actionTag=["Sleeping", "Eating and Drinking",
"Personal Care", "Work",
"Regular Education", "Irregular Education",
"Household Activity", "Family Care",
"Volunteering",
"Socializing", "Ordinary person Education",
"Media Use", "Religious Activity",
"Cultural Event", "Sports",
"Other Leisure", "Move", "Others"];

color.domain(actionTag);

/*
var back = document.createElement("img");
back.setAttribute("src", "http://wstatic.naver.com/w9/btn_pre.gif");
back.setAttribute("style", "cursor:pointer");
back.setAttribute("border", "0");
document.body.appendChild(back);

back.onclick = function(){
	var browser=d3.selectAll(".browser .area")[0];
	if(contIdx>0)
		contIdx--;
	else
		return;
	
	for(var idx=0; idx<browser.length; idx++) {
		if(idx!=contIdx) {
			d3.select(browser[idx]).transition()
			.delay(0).duration(1000)
			.style("fill-opacity", "0.2");
		}
		else {
			d3.select(browser[idx]).transition()
			.delay(0).duration(1000)
			.style("fill-opacity", "1");
		}
	}
	
	container=browser[contIdx];
};

var forward = document.createElement("img");
forward.setAttribute("src", "http://wstatic.naver.com/w9/btn_next.gif");
forward.setAttribute("style", "cursor:pointer");
forward.setAttribute("border", "0");
document.body.appendChild(forward);

forward.onclick = function(){
	var browser=d3.selectAll(".browser .area")[0];
	console.log(browser.length);
	if(contIdx<browser.length-1)
		contIdx++;
	else
		return;
	
	for(var idx=0; idx<browser.length; idx++) {
		if(idx!=contIdx) {
			d3.select(browser[idx]).transition()
			.delay(0).duration(1000)
			.style("fill-opacity", "0.2");
		}
		else {
			d3.select(browser[idx]).transition()
			.delay(0).duration(1000)
			.style("fill-opacity", "1");
		}
	}
	
	container=browser[contIdx];
};			
*/
function tagTop() {
	return tagStack[tagStack.length-1];
}
function infoTop() {
	return infoStack[infoStack.length-1];
}

function sumAction(object) {
	var reObject=[];
	for(var i=0; i<object[0].action.length; i++) {
		reObject[i]={
				"time":null,
				"action":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0]
		};
	}
	for(var i=0; i<object.length; i++) {
		for(var j=0; j<object[0].action.length; j++) {
			if(object[i].action[j]=="1")
				reObject[j].action[0]++;
			else if(object[i].action[j]=="2")
				reObject[j].action[1]++;
			else if(object[i].action[j]=="3")
				reObject[j].action[2]++;
			else if(object[i].action[j]=="4")
				reObject[j].action[3]++;
			else if(object[i].action[j]=="5")
				reObject[j].action[4]++;
			else if(object[i].action[j]=="6")
				reObject[j].action[5]++;
			else if(object[i].action[j]=="7")
				reObject[j].action[6]++;
			else if(object[i].action[j]=="8")
				reObject[j].action[7]++;
			else if(object[i].action[j]=="9")
				reObject[j].action[8]++;
			else if(object[i].action[j]=="A")
				reObject[j].action[9]++;
			else if(object[i].action[j]=="B")
				reObject[j].action[10]++;
			else if(object[i].action[j]=="C")
				reObject[j].action[11]++;
			else if(object[i].action[j]=="D")
				reObject[j].action[12]++;
			else if(object[i].action[j]=="E")
				reObject[j].action[13]++;
			else if(object[i].action[j]=="F")
				reObject[j].action[14]++;
			else if(object[i].action[j]=="G")
				reObject[j].action[15]++;
			else if(object[i].action[j]=="H")
				reObject[j].action[16]++;
			else if(object[i].action[j]=="I")
				reObject[j].action[17]++;
		}
	}
	
	for(var i=0, hour=0, minute=0; i<144; i++, minute=(minute+10)%60) {
		var sum=0;
		for(var j=0; j<reObject[0].action.length; j++) {
			reObject[i].action[j]=reObject[i].action[j]/object.length*100;
			sum+=reObject[i].action[j];
		}
		
		reObject[i].time=hour.toString()+":"+minute.toString();
		reObject[i].time = format.parse(reObject[i].time);
		if(minute==50) hour++;
	}
	
	return reObject;
}


function maxIndex(object) {
	var max = object[0].y;
	var index = 0;
	for (var i = 1; i < object.length; i++) {
		if (object[i].y > max) {
			max = object[i].y;
			index = i;
		}
	}
	return index;
}

function animateLineThick() {
	d3.select(this)
	.style("stroke", "#2E2E2E")
	.style("stroke-width", "1px");
}
function animateLineThin() {
	d3.select(this)
	.style("stroke-width", "0px");
}


function animateLineOnly(d, i) {
	var browser=d3.selectAll(".browser .area")[0];
	contIdx=i;
	
	if(container===undefined) {
		for(var idx=0; idx<browser.length; idx++) {
			if(idx!=i) {
				d3.select(browser[idx]).transition()
				.delay(0).duration(1000)
				.style("fill-opacity", "0.2");
			}
		}
		
		/* Detail Panel */
		var widthDtl=350;
		var heightDtl=190;
		var gWidth=width/2-widthDtl/2;
		var gHeight=height/2-heightDtl/2;
		d3.select("svg g").append("g")
		.attr("class", "dtlGroup")
		.append("rect")
		.attr("class", "dtlPanel")
		.attr("x", gWidth)
		.attr("y", gHeight-30)
		.attr("width", widthDtl)
		.attr("height", function() {
			return i>=16?heightDtl-20:heightDtl;
		})
		.attr("fill", "#000000")
		.attr("fill-opacity", 0);
		
		var rgW;
		var rgH;
		d3.select(".dtlGroup")
		.append("text")
		.attr("class", "dtlTitle")
		.attr("x", rgW=gWidth+30)
		.attr("y", rgH=gHeight+15)
		.text(contents.title[i]);
		
		d3.select(".dtlGroup")
		.append("text")
		.attr("class", "dtlCont")
		.attr("x", rgW)
		.attr("y", rgH=rgH+30)
		.text(contents.subtitle[i]);
		
		d3.select(".dtlGroup")
		.append("text")
		.attr("class", "dtlExm")
		.attr("x", rgW=rgW+1)
		.attr("y", rgH=rgH+17)
		.text(contents.contents[i]);
		
		d3.select(".dtlGroup")
		.append("text")
		.attr("class", "dtlExm")
		.attr("x", rgW)
		.attr("y", rgH=rgH+15)
		.text(contents.contents2[i]);
		
		var sum=0;
		for(var j=0; j<d.values.length; j++) {
			sum+=d.values[j].y;
		}
		sum=sum/144*100;
		sum.toString().length;
		
		
		d3.select(".dtlGroup")
		.append("text")
		.attr("class", "dtlSum")
		.attr("x", rgW)
		.attr("y", function() {
			return i>=16?rgH=rgH+35:rgH=rgH+55;
		})
		.text(sum.toFixed(1));

		d3.select(".dtlGroup")
		.append("text")
		.attr("class", "dtlPer")
		.attr("x", function() {
			if(sum.toFixed(1).toString().length==3)
				return rgW=rgW+73;
			else
				return rgW=rgW+100;
		})
		.attr("y", rgH)
		.text("%");
		
		d3.selectAll(".dtlGroup text")
		.attr("fill-opacity", 0);
		
		
		d3.select(".dtlPanel")
		.transition()
		.duration(500)
		.attr("fill-opacity", 0.1);
		
		d3.selectAll(".dtlGroup text")
		.transition()
		.duration(500)
		.attr("fill-opacity", 1);
		
		
		
		container=this;
	}
	
	if(container==this)
		return;
	else {
		d3.selectAll(browser).transition()
		.delay(0).duration(1000)
		.style("fill-opacity", "1");
		
		d3.select(".dtlPanel")
		.transition()
		.duration(500)
		.style("fill-opacity", 0).remove();
		
		d3.selectAll(".dtlGroup text")
		.transition()
		.duration(500)
		.style("fill-opacity", 0).remove();
		
		d3.select(".dtlGroup")
		.transition()
		.duration(500)
		.style("fill-opacity", 0).remove();
		
		container=undefined;
	}
}

function defaultGraph() {
	var browser=d3.selectAll(".browser .area")[0];
	
	d3.selectAll(browser).transition()
	.delay(0).duration(500)
	.style("fill-opacity", "1");
	
	d3.select(".dtlPanel")
	.transition()
	.duration(500)
	.style("fill-opacity", 0).remove();
	
	d3.selectAll(".dtlGroup text")
	.transition()
	.duration(500)
	.style("fill-opacity", 0).remove();
	
	d3.select(".dtlGroup")
	.transition()
	.duration(500)
	.style("fill-opacity", 0).remove();
	
	container=undefined;
}


function check_only(value, name) {
	defaultGraph();
	
	var obj = document.getElementsByName(name);
	var idx;
	for (var i = 0; i < obj.length; i++) {
		if (obj[i].value != value)
			obj[i].checked = false;
		else
			idx=i;
	}
	
	if(name=="chkbox0") {
		showGraph(0, 0);
		$('#dynamicTitle').animate({
			'opacity' : 0
		}, 200, function() {
			$(this).html("Current Tag : All");
		}).animate({
			'opacity' : 1
		}, 200);
		return;
	}
	
	if(obj[idx].checked) {
		if(name.length==7) {
			showGraph(Number(name.charAt(6)), value);
		} else if(name.length==8) {
			showGraph(Number(name.substr(6, 2)), value);
		}
	} else {
		if(name.length==7) {
			showGraph(Number(name.charAt(6)), null);
		} else if(name.length==8) {
			showGraph(Number(name.substr(6, 2)), null);
		}
	}
	
	showTitle();
}

function showTitle() {

	var str = "";
	var strArray = [];

	$("input:checkbox:checked").each(function(index) {
		str += $(this).attr("name") + "/";
		str += $(this).attr("value") + ",";
		strArray.push(str);
		str = "";
	});
	var strSumArray = [];
	var temp = "";
	
	for (var i = 0; i < strArray.length; i++) {
		
		
		switch(strArray[i]) {
			case "chkbox1/1,":
				str += "(Sex)Male ";
				break;
			case "chkbox1/2,":
				str += "(Sex)Female ";
				break;
			case "chkbox2/1,":
				str += "(Age)10 - 19 ";
				break;
			case "chkbox2/2,":
				str += "(Age)20 - 29 ";
				break;
			case "chkbox2/3,":
				str += "(Age)30 - 39 ";
				break;
			case "chkbox2/4,":
				str += "(Age)40 - 49 ";
				break;
			case "chkbox2/5,":
				str += "(Age)50 - ";
				break;
			case "chkbox3/1,":
				str += "(Marriage)Single ";
				
				break;
			case "chkbox3/2,":
				str += "(Marriage)Married ";
				break;
			case "chkbox3/3,":
				str += "(Marriage)Bereavement ";
				break;
			case "chkbox3/4,":
				str += "(Marriage)Divorced ";
				break;
			case "chkbox4/0,":
				str += "(Preschool Children)No Children ";
				break;
			case "chkbox4/1,":
				str += "(Preschool Children)One ";
				break;
			case "chkbox4/2,":
				str += "(Preschool Children)Two ";
				break;
			case "chkbox5/1,":
				str += "(Economic)Yes ";
				break;
			case "chkbox5/2,":
				str += "(Economic)No ";
				break;
			case "chkbox6/1,":
				str += "(Education)Elementary ";
				break;
			case "chkbox6/2,":
				str += "(Education)Middle School ";
				break;
			case "chkbox6/3,":
				str += "(Education)High School ";
				break;
			case "chkbox6/4,":
				str += "(Education)Bachelor ";
				break;
			case "chkbox6/5,":
				str += "(Education)Master ";
				break;
			case "chkbox6/6,":
				str += "(Education)Doctor ";
				break;
			case "chkbox7/1,":
				str += "(Industry)Primary Industry ";
				break;
			case "chkbox7/2,":
				str += "(Industry)Manufacturing ";
				break;
			case "chkbox7/3,":
				str += "(Industry)Construction ";
				break;
			case "chkbox7/4,":
				str += "(Industry)Whole sale / Retail ";
				break;
			case "chkbox7/5,":
				str += "(Industry)Express ";
				break;
			case "chkbox7/6,":
				str += "(Industry)Lodging / Restaurant ";
				break;
			case "chkbox7/7,":
				str += "(Industry)Financial / Insurance ";
				break;
			case "chkbox7/8,":
				str += "(Industry)Real Estate Science ";
				break;
			case "chkbox7/9,":
				str += "(Industry)Public office / etc ";
				break;
			case "chkbox8/1,":
				str += "(Job)Manager ";
				break;
			case "chkbox8/2,":
				str += "(Job)Expert ";
				break;
			case "chkbox8/3,":
				str += "(Job)Clerks ";
				break;
			case "chkbox8/4,":
				str += "(Job)Service ";
				break;
			case "chkbox8/5,":
				str += "(Job)Salesman ";
				break;
			case "chkbox8/6,":
				str += "(Job)Farmer / Fisher ";
				break;
			case "chkbox8/7,":
				str += "(Job)Engineer ";
				break;
			case "chkbox8/8,":
				str += "(Job)Assembler ";
				break;
			case "chkbox8/9,":
				str += "(Job)Labor ";
				break;
			case "chkbox9/1,":
				str += "(Profit)Ordinary People ";
				break;
			case "chkbox9/2,":
				str += "(Profit)Middle People ";
				break;
			case "chkbox9/3,":
				str += "(Profit)Upper People ";
				break;

			case "chkbox10/1,":
				str += "(Position)Employer ";
				break;
			case "chkbox10/2,":
				str += "(Position)Employee ";
				break;
			case "chkbox10/2,":
				str += "(Position)Individual proprietor ";
				break;
			case "chkbox11/1,":
				str += "(Satisfy)Satisfied ";
				break;
			case "chkbox11/1,":
				str += "(Satisfy)Unsatisfied ";
				break;
		}
	}
console.log(str);
	$('#dynamicTitle').animate({
		'opacity' : 0
	}, 200, function() {
		if(str!=""){
		$(this).html("Current Tag : " + str);}
		else{
			$(this).html("Current Tag : All" );
			
		}
	}).animate({
		'opacity' : 1
	}, 200);
}
function init() {
	/*
	d3.select("#a10").on("click", function(d, i) {
		showGraph(2, 1);
	});
	*/
	showGraph(null, null);
}
var mark1=false;
var mark2=false;
var mark3=false;
var mark4=false;
var mark5=false;
var isMaximum=false;
function checkBoxControl() {
	var checkBox=d3.selectAll("input[type=checkbox]")[0];
	if(tagStack.length!=4) {
		for(var i=0; i<checkBox.length; i++)
			checkBox[i].disabled=false;
	}
	// case 1
	var eduBox=d3.selectAll("input[name=chkbox6]")[0];
	for(var i=0; i<infoStack.length; i++) {
		if(infoStack[i].index==2) {
			if(infoStack[i].proper=="1") {
				eduBox[3].disabled=true;
				eduBox[4].disabled=true;
				eduBox[5].disabled=true;
				mark1=true;
				break;
			} else {
				eduBox[3].disabled=false;
				eduBox[4].disabled=false;
				eduBox[5].disabled=false;
				break;
			}
		}
		if(mark1) {
			eduBox[3].disabled=false;
			eduBox[4].disabled=false;
			eduBox[5].disabled=false;
		}
	}
	
	// case 2
	var childBox=d3.selectAll("input[name=chkbox4]")[0];
	for(var i=0; i<infoStack.length; i++) {
		if(infoStack[i].index==3) {
			if(infoStack[i].proper=="1") {
				childBox[1].disabled=true;
				childBox[2].disabled=true;
				mark2=true;
				break;
			} else {
				childBox[1].disabled=false;
				childBox[2].disabled=false;
				break;
			}
		}
		if(mark2) {
			childBox[1].disabled=false;
			childBox[2].disabled=false;
		}
	}
	
	// case 3, 4, 5
	var induBox=d3.selectAll("input[name=chkbox7]")[0];
	var jobBox=d3.selectAll("input[name=chkbox8]")[0];
	var positionBox=d3.selectAll("input[name=chkbox10]")[0];
	for(var i=0; i<infoStack.length; i++) {
		if(infoStack[i].index==5) {
			if(infoStack[i].proper=="2") {
				for(var j=0; j<induBox.length; j++)
					induBox[j].disabled=true;
				for(var j=0; j<jobBox.length; j++)
					jobBox[j].disabled=true;
				for(var j=0; j<positionBox.length; j++)
					positionBox[j].disabled=true;
				mark3=true;
				break;
			} else {
				for(var j=0; j<induBox.length; j++)
					induBox[j].disabled=false;
				for(var j=0; j<jobBox.length; j++)
					jobBox[j].disabled=false;
				for(var j=0; j<positionBox.length; j++)
					positionBox[j].disabled=false;
				break;
			}
		}
		if(mark3) {
			for(var j=0; j<induBox.length; j++)
				induBox[j].disabled=false;
			for(var j=0; j<jobBox.length; j++)
				jobBox[j].disabled=false;
			for(var j=0; j<positionBox.length; j++)
				positionBox[j].disabled=false;
		}
	}
	
	// case 6
	for(var i=0; i<infoStack.length; i++) {
		if(infoStack[i].index==7) {
			for(var j=0; j<jobBox.length; j++)
				jobBox[j].disabled=true;
			mark4=true;
			break;
		}
		if(infoStack[i].index==8) {
			for(var j=0; j<induBox.length; j++)
				induBox[j].disabled=true;
			mark5=true;
			break;
		}
		
		if(mark4) {
			for(var j=0; j<jobBox.length; j++)
				jobBox[j].disabled=false;
		}
		if(mark5) {
			for(var j=0; j<induBox.length; j++)
				induBox[j].disabled=false;
		}
	}
	
	// All
	if (tagStack.length==1){
		for(var i=0; i<checkBox.length; i++)
			checkBox[i].checked=false;
	}
	
	// Maximum Tag
	if(tagStack.length==4) {
		for(var i=0; i<checkBox.length; i++) {
			var cIndex;
			if(checkBox[i].name.length==6)
				cIndex=Number(checkBox[i].name.charAt(6));
			if(checkBox[i].name.length==7)
				cIndex=Number(checkBox[i].name.substr(6, 2));
			
			var isSame=false;
			for(var j=0; j<infoStack.length; j++) {
				if(infoStack[j].index==cIndex)
					isSame=true;
			}
			
			if(!isSame)
				checkBox[i].disabled=true;
		}
	} 

}

function filterTag(data) {
	for(var k=0; k<infoStack.length; k++) {
		var fObj=[];
		if(infoStack[k].set)
			continue;
		
		// case num : null, (NOT in 0), 1, 2, 3, .....
		switch(infoStack[k].index) {
		case null:
			for(var i=0; i<40526; i++) {
				fObj[i]={
					sex:data[i].sex,
					age:data[i].age,
					marriage:data[i].marriage,
					children:data[i].children,
					economic:data[i].economic,
					education:data[i].education,
					industry:data[i].industry,
					job:data[i].job,
					profit:data[i].profit,
					position:data[i].position,
					satisfy:data[i].satisfy,
					action:[data[i]._0000, data[i]._0010, data[i]._0020, data[i]._0030, data[i]._0040, data[i]._0050,
						data[i]._0100, data[i]._0110, data[i]._0120, data[i]._0130, data[i]._0140, data[i]._0150,
						data[i]._0200, data[i]._0210, data[i]._0220, data[i]._0230, data[i]._0240, data[i]._0250,
						data[i]._0300, data[i]._0310, data[i]._0320, data[i]._0330, data[i]._0340, data[i]._0350,
						data[i]._0400, data[i]._0410, data[i]._0420, data[i]._0430, data[i]._0440, data[i]._0450,
						data[i]._0500, data[i]._0510, data[i]._0520, data[i]._0530, data[i]._0540, data[i]._0550,
						data[i]._0600, data[i]._0610, data[i]._0620, data[i]._0630, data[i]._0640, data[i]._0650,
						data[i]._0700, data[i]._0710, data[i]._0720, data[i]._0730, data[i]._0740, data[i]._0750,
						data[i]._0800, data[i]._0810, data[i]._0820, data[i]._0830, data[i]._0840, data[i]._0850,
						data[i]._0900, data[i]._0910, data[i]._0920, data[i]._0930, data[i]._0940, data[i]._0950,
						data[i]._1000, data[i]._1010, data[i]._1020, data[i]._1030, data[i]._1040, data[i]._1050,
						data[i]._1100, data[i]._1110, data[i]._1120, data[i]._1130, data[i]._1140, data[i]._1150,
						data[i]._1200, data[i]._1210, data[i]._1220, data[i]._1230, data[i]._1240, data[i]._1250,
						data[i]._1300, data[i]._1310, data[i]._1320, data[i]._1330, data[i]._1340, data[i]._1350,
						data[i]._1400, data[i]._1410, data[i]._1420, data[i]._1430, data[i]._1440, data[i]._1450,
						data[i]._1500, data[i]._1510, data[i]._1520, data[i]._1530, data[i]._1540, data[i]._1550,
						data[i]._1600, data[i]._1610, data[i]._1620, data[i]._1630, data[i]._1640, data[i]._1650,
						data[i]._1700, data[i]._1710, data[i]._1720, data[i]._1730, data[i]._1740, data[i]._1750,
						data[i]._1800, data[i]._1810, data[i]._1820, data[i]._1830, data[i]._1840, data[i]._1850,
						data[i]._1900, data[i]._1910, data[i]._1920, data[i]._1930, data[i]._1940, data[i]._1950,
						data[i]._2000, data[i]._2010, data[i]._2020, data[i]._2030, data[i]._2040, data[i]._2050,
						data[i]._2100, data[i]._2110, data[i]._2120, data[i]._2130, data[i]._2140, data[i]._2150,
						data[i]._2200, data[i]._2210, data[i]._2220, data[i]._2230, data[i]._2240, data[i]._2250,
						data[i]._2300, data[i]._2310, data[i]._2320, data[i]._2330, data[i]._2340, data[i]._2350
					]
				};
			}
			break;
		case 1:
			for(var i=0, j=0; i<tagTop().length; i++) {
				if(tagTop()[i].sex==infoStack[k].proper)
					fObj[j++]=tagTop()[i];
			}
			break;
		case 2:
			for(var i=0, j=0; i<tagTop().length; i++) {
				if(tagTop()[i].age==infoStack[k].proper)
					fObj[j++]=tagTop()[i];
			}
			break;
		case 3:
			for(var i=0, j=0; i<tagTop().length; i++) {
				if(tagTop()[i].marriage==infoStack[k].proper)
					fObj[j++]=tagTop()[i];
			}
			break;
		case 4:
			for(var i=0, j=0; i<tagTop().length; i++) {
				if(tagTop()[i].children==infoStack[k].proper)
					fObj[j++]=tagTop()[i];
			}
			break;
		case 5:
			for(var i=0, j=0; i<tagTop().length; i++) {
				if(tagTop()[i].economic==infoStack[k].proper)
					fObj[j++]=tagTop()[i];
			}
			break;
		case 6:
			for(var i=0, j=0; i<tagTop().length; i++) {
				if(tagTop()[i].education==infoStack[k].proper)
					fObj[j++]=tagTop()[i];
			}
			break;
		case 7:
			for(var i=0, j=0; i<tagTop().length; i++) {
				if(tagTop()[i].industry==infoStack[k].proper)
					fObj[j++]=tagTop()[i];
			}
			break;
		case 8:
			for(var i=0, j=0; i<tagTop().length; i++) {
				if(tagTop()[i].job==infoStack[k].proper)
					fObj[j++]=tagTop()[i];
			}
			break;
		case 9:
			for(var i=0, j=0; i<tagTop().length; i++) {
				if(tagTop()[i].profit==infoStack[k].proper)
					fObj[j++]=tagTop()[i];
			}
			break;
		case 10:
			for(var i=0, j=0; i<tagTop().length; i++) {
				if(tagTop()[i].position==infoStack[k].proper)
					fObj[j++]=tagTop()[i];
			}
			break;
		case 11:
			for(var i=0, j=0; i<tagTop().length; i++) {
				if(tagTop()[i].satisfy==infoStack[k].proper)
					fObj[j++]=tagTop()[i];
			}
			break;
		}
		
		infoStack[k].set=true;
		if(fObj.length==0) {
			alert("Number of Sample Data is 0");
			return;
		}
		else {
			tagStack.push(fObj);
		}
	}
	console.log(infoStack);
	console.log(tagStack);
	
	hS[0]=tagTop().length/40526*height;
	
	checkBoxControl();
}

function searchTagStack(index, proper) {
	console.log("index:"+index);
	console.log("proper:"+proper);
	
	// Init exception (null, null)
	if(infoStack.length==0) {
		infoStack.push({index:index, proper:proper, set:false});
		return;
	}
	
	// All tag exception (0, 0)
	if(index==0) {
		while(infoStack.length>1) {
			infoStack.pop();
			tagStack.pop();
		}
		return;
	}
	
	var isChange=false;
	for(var i=0; i<infoStack.length; i++) {
		if(infoStack[i].index==index) {
			if(proper==null) { // Button unchecked
				infoStack=remove(infoStack, i);
				while(i<tagStack.length) // clear tagStack
					tagStack.pop();
				isChange=true;
				if(i==infoStack.length)
					break;
			}
			else { // Button changed
				infoStack[i].proper=proper;
				infoStack[i].set=false;
				while(i<tagStack.length) // clear tagStack
					tagStack.pop();
				isChange=true;
				continue;
			}
		}
		//console.log(isChange);
		
		if(isChange)// reset exist data
			infoStack[i].set=false;
	}
	
	// New tag data
	if(!isChange)
		infoStack.push({index:index, proper:proper, set:false});
}

function showGraph(index, proper) {
	var svg;
	if(index==null) {
		svg = d3.select(".graph")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + (margin.top-40) + ")");
		
		console.log(svg);
	} else {
		svg = d3.select("svg g");
	}

	d3.csv("data/stats_data.csv", function(data) {
		searchTagStack(index, proper);
		filterTag(data);
		
		var refObj=sumAction(tagTop());
		var browsers = stack(color.domain().map(function(name, i) {
				return {
					name : name,
					values : refObj.map(function (d) {
						return {
							time : d.time,
							y : d.action[i] / 100
						};
					})
				};
			}));
		
		x.domain([format.parse("00:00"), format.parse("23:50")]);
		
		var browser=svg.selectAll(".browser").data(browsers);
		
		// Update
		browser.select("path")
		.transition()
		.duration(1000)
		.attr("d", function(d) {
			return area(d.values); });
		
		svg.selectAll(".actionText")
			.data(browsers)
			.datum(function(d) {
					return {
						name : d.name,
						value : d.values[maxIndex(d.values)]
					}; })
			.transition()
			.duration(1000)
			.attr("transform", function(d) {
					return "translate(" + x(d.value.time) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
			.attr("dy", ".35em");
		
		// Enter
		if(index==null) {
			browser.enter()
			.append("g")
			.attr("class", "browser");
		
			browser.append("path")
			.attr("class", "area")
			.attr("d", function(d) {
				return area(d.values); })
			.style("fill", function(d) {
				return color(d.name); })
			.on("mouseover", animateLineThick)
			.on("mouseout", animateLineThin)
			.on("mousedown", animateLineOnly);
			
			
			
			var rule_x = svg.selectAll("g.rule")
				.data(y.ticks(5))
				.enter()
				.append("svg:g")
				.attr("class", "rule_x")
				.attr("transform", function(d) {
					return "translate(0," + y(d) + ")";
				});
			var rule_y = svg.selectAll("g.rule")
				.data(x.ticks())
				.enter()
				.append("svg:g")
				.attr("class", "rule_y")
				.attr("transform", function(d) {
					return "translate(" + x(d) + ",0)";
				});
				
			rule_x.append("svg:line")
				.attr("x2", width)
				.style("stroke", function(d) {
					return d?"#FFFFFF":"#000000";
				})
				.style("stroke-opacity", function(d) {
					return d ? .2 : null;
				});
				
			rule_y.append("svg:line")
				.attr("y2", height)
				.style("stroke", function(d) {
					return d?"#FFFFFF":"#000000";
				})
				.style("stroke-opacity", function(d) {
					return d ? .2 : null;
				});
		
		
			var text=svg.selectAll("g.text")
			.data(browsers)
			.enter()		
			.append("svg:text").datum(function(d) {
					return {
						name : d.name,
						value : d.values[maxIndex(d.values)]
					}; })
			.attr("transform", function(d) {
					return "translate(" + x(d.value.time) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
			.attr("dy", ".35em").text(function(d) {
				return d.name; })
			.attr("text-anchor", "middle")
			.attr("class", "actionText");
				
			svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
			svg.append("g").attr("class", "y axis").call(yAxis);
			
			
		}
			
		// Exit
		browser.exit()
		.transition()
		.duration(300)
		.remove();

		
		var xColor=d3.scale.linear().domain([0, 390])
		.range(["#F15F5F", "#6799FF"]).interpolate(d3.interpolateLab);
		
		// Update
		d3.select(".sampleBar").data(hS)
		.transition()
		.duration(1000)
		.attr("y", function (d) {
					return height-d;
				})
		.attr("height", function(d) {
					return d;
				})
		.attr("fill", function(d) {
			return xColor(d);
		});
		
		d3.select(".sampleNum").data(hS)
		.transition()
		.duration(1000)
		.attr("transform", function(d) {
			var result=height-d+20;
			return "translate("+ wS/2 +", " + result + ")";
		})
		.text(tagTop().length)
		.style("fill", function(d) {
				return (tagTop().length<4000)?"#353535":"#F6F6F6";
			});
		
		d3.select(".sampleText").data(hS)
		.transition()
		.duration(1000)
		.attr("transform", function(d) {
			var result=height-d+35;
			return "translate("+ wS/2 +", " + result + ")";
		})
		.style("fill", function(d) {
				return (tagTop().length<4000)?"#353535":"#F6F6F6";
			});
		
		// Enter
		if(index==null) {
			d3.select(".graph")
			.append("svg")
			.attr("class", "svgS")
			.attr("width", widthS)
			.attr("height", height+margin.top+margin.bottom)
			.append("g")
			.attr("transform", "translate( 0," + (margin.top-40) + ")");
			
			d3.select(".svgS g")
			.selectAll("rect").data(hS).enter().append("rect")
			.attr("class", "sampleBar")
			.attr("x", 0)
			.attr("y", function (d) {
						return height-d;
					})
			.attr("width", wS).attr("height", function(d) {
						return d;
					})
			.attr("fill", function(d) {
				return xColor(d);
			});
			
			d3.select(".svgS g").append("g").attr("class", "y axis")
					.attr("transform", "translate(" + wS + ", 0)")
					.call(yAxisS);
			
			
			d3.select(".svgS g")
			.selectAll("g.text").data(hS).enter().append("text").attr("class", "sampleNum")
			.attr("transform", function(d) {
				var result=height-d+20;
				return "translate("+ wS/2 +", " + result + ")";
			})
			.text(tagTop().length)
			.attr("text-anchor", "middle")
			.style("fill", function(d) {
				return (tagTop().length<4000)?"#353535":"#F6F6F6";
			});
			
			d3.select(".svgS g")
			.selectAll("g.text").data(hS).enter().append("text").attr("class", "sampleText")
			.attr("transform", function(d) {
				var result=height-d+35;
				return "translate("+ wS/2 +", " + result + ")";
			})
			.text("samples")
			.attr("text-anchor", "middle")
			.style("fill", function(d) {
				return (tagTop().length<4000)?"#353535":"#F6F6F6";
			});	
		}
		
		
		
	});
}