(function() {
    let shadowRoot;

    var Ar = [];
    var ArChartGauge = [];

    let template = document.createElement("template");
    template.innerHTML = `
		<style type="text/css">	
		body {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
		}
		</style>       
	`;

    //https://www.amcharts.com/lib/4/core.js
    const amchartscorejs = "https://fedems.github.io/SACGSheet/box/core.js";
    //https://www.amcharts.com/lib/4/charts.js
    const amchartschartsjs = "https://fedems.github.io/SACGSheet/box/charts.js";
    //https://www.amcharts.com/lib/4/themes/animated.js
    const amchartsanimatedjs = "https://fedems.github.io/SACGSheet/box/animated.js";

	function loadScript(src) {
	  return new Promise(function(resolve, reject) {
		let script = document.createElement('script');
		script.src = src;

		script.onload = () => {console.log("Load: " + src); resolve(script);}
		script.onerror = () => reject(new Error(`Script load error for ${src}`));

		shadowRoot.appendChild(script)
	  });
	}

    // Create the chart
    function Amchart(id, divid, value, title, firsttime) {

//        var data = {};
//        if (value !== "") {
//            data = JSON.parse(value);
//            console.log(data);
//        }

        if(firsttime === 0) {
			// Themes begin
			am4core.useTheme(am4themes_animated);
			// Themes end
            
            var chartMin = -50;
            var chartMax = 100;

            var data = {
              score: 52.7,
              gradingData: [
                {
                  title: "Malo",
                  color: "#ee1f25",
                  lowScore: -100,
                  highScore: -20
                },
                {
                  title: "Volatil",
                  color: "#f04922",
                  lowScore: -20,
                  highScore: 0
                },
                {
                  title: "Bajo",
                  color: "#fdae19",
                  lowScore: 0,
                  highScore: 20
                },
                {
                  title: "Desarrollo",
                  color: "#f3eb0c",
                  lowScore: 20,
                  highScore: 40
                },
                {
                  title: "Maduro",
                  color: "#b0d136",
                  lowScore: 40,
                  highScore: 60
                },
                {
                  title: "Sostenible",
                  color: "#54b947",
                  lowScore: 60,
                  highScore: 80
                },
                {
                  title: "Alto",
                  color: "#0f9747",
                  lowScore: 80,
                  highScore: 100
                }
              ]
            };
            
            /**
            Grading Lookup
             */
            function lookUpGrade(lookupScore, grades) {
              // Only change code below this line
              for (var i = 0; i < grades.length; i++) {
                if (
                  grades[i].lowScore < lookupScore &&
                  grades[i].highScore >= lookupScore
                ) {
                  return grades[i];
                }
              }
              return null;
            }

			// Create chart instance
			var chart = am4core.create(divid, am4charts.GaugeChart);
            
            chart.hiddenState.properties.opacity = 0;
            chart.fontSize = 8;
            chart.innerRadius = am4core.percent(80);
            chart.resizable = true;
                        
            /**
             * Normal axis
             */

            var axis = chart.xAxes.push(new am4charts.ValueAxis());
            
            axis.min = chartMin;
            axis.max = chartMax;
            axis.strictMinMax = true;
            axis.renderer.radius = am4core.percent(80);
            axis.renderer.inside = true;
            axis.renderer.line.strokeOpacity = 0.1;
            axis.renderer.ticks.template.disabled = false;
            axis.renderer.ticks.template.strokeOpacity = 1;
            axis.renderer.ticks.template.strokeWidth = 0.5;
            axis.renderer.ticks.template.length = 5;
            axis.renderer.grid.template.disabled = true;
            axis.renderer.labels.template.radius = am4core.percent(15);
            axis.renderer.labels.template.fontSize = "0.9em";

            /**
             * Axis for ranges
             */

            var axis2 = chart.xAxes.push(new am4charts.ValueAxis());
            
            axis2.min = chartMin;
            axis2.max = chartMax;
            axis2.strictMinMax = true;
            axis2.renderer.labels.template.disabled = true;
            axis2.renderer.ticks.template.disabled = true;
            axis2.renderer.grid.template.disabled = false;
            axis2.renderer.grid.template.opacity = 0.5;
            axis2.renderer.labels.template.bent = true;
            axis2.renderer.labels.template.fill = am4core.color("#000");
            axis2.renderer.labels.template.fontWeight = "bold";
            axis2.renderer.labels.template.fillOpacity = 0.3;

            /**
            Ranges
            */

            for (let grading of data.gradingData) {
              var range = axis2.axisRanges.create();
              range.axisFill.fill = am4core.color(grading.color);
              range.axisFill.fillOpacity = 0.8;
              range.axisFill.zIndex = -1;
              range.value = grading.lowScore > chartMin ? grading.lowScore : chartMin;
              range.endValue = grading.highScore < chartMax ? grading.highScore : chartMax;
              range.grid.strokeOpacity = 0;
              range.stroke = am4core.color(grading.color).lighten(-0.1);
              range.label.inside = true;
              range.label.text = grading.title.toUpperCase();
              range.label.inside = true;
              range.label.location = 0.5;
              range.label.inside = true;
              range.label.radius = am4core.percent(10);
              range.label.paddingBottom = -5; // ~half font size
              range.label.fontSize = "0.9em";
            }

            var matchingGrade = lookUpGrade(data.score, data.gradingData);

            /**
             * Label 1
             */

            var label = chart.radarContainer.createChild(am4core.Label);
            label.isMeasured = false;
            label.fontSize = "3em";
            label.x = am4core.percent(50);
            label.paddingBottom = 15;
            label.horizontalCenter = "middle";
            label.verticalCenter = "bottom";
            //label.dataItem = data;
            label.text = data.score.toFixed(1);
            //label.text = "{score}";
            label.fill = am4core.color(matchingGrade.color);

            /**
             * Label 2
             */

            var label2 = chart.radarContainer.createChild(am4core.Label);
            label2.isMeasured = false;
            label2.fontSize = "2em";
            label2.horizontalCenter = "middle";
            label2.verticalCenter = "bottom";
            label2.text = matchingGrade.title.toUpperCase();
            label2.fill = am4core.color(matchingGrade.color);


            /**
             * Hand
             */

            var hand = chart.hands.push(new am4charts.ClockHand());
            hand.axis = axis2;
            hand.innerRadius = am4core.percent(55);
            hand.startWidth = 8;
            hand.pin.disabled = true;
            hand.value = data.score;
            hand.fill = am4core.color("#444");
            hand.stroke = am4core.color("#000");

            hand.events.on("positionchanged", function(){
              label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
              var value2 = axis.positionToValue(hand.currentPosition);
              var matchingGrade = lookUpGrade(axis.positionToValue(hand.currentPosition), data.gradingData);
              label2.text = matchingGrade.title.toUpperCase();
              label2.fill = am4core.color(matchingGrade.color);
              label2.stroke = am4core.color(matchingGrade.color);  
              label.fill = am4core.color(matchingGrade.color);
            })
            
//            setInterval(function() {
//                var value = chartMin + Math.random() * (chartMax - chartMin);
//                hand.showValue(value, 1000, am4core.ease.cubicOut);
//            }, 2000);
		  } 
          else {            	
            	var foundIndex = Ar.findIndex(x => x.id == id);
    			console.log("foundIndex drawChart: " + foundIndex);
    			ArChartGauge[foundIndex].chart.data = data;
            }

    };

    function Draw(Ar, firsttime) {
        for (var i = 0; i < Ar.length; i++) {
			Amchart(Ar[i].id, Ar[i].div, Ar[i].value, "", firsttime)
        }
    };

    class Box extends HTMLElement {
        constructor() {
            console.log("constructor");
            super();
            shadowRoot = this.attachShadow({
                mode: "open"
            });

            shadowRoot.appendChild(template.content.cloneNode(true));

            this._firstConnection = 0;

            this.addEventListener("click", event => {
                console.log('click');
                var event = new Event("onClick");
                this.dispatchEvent(event);

            });
            this._props = {};
        }

        //Fired when the widget is added to the html DOM of the page
		connectedCallback() {
            console.log("connectedCallback");
        }

		//Fired when the widget is removed from the html DOM of the page (e.g. by hide)
		disconnectedCallback() {
			console.log("disconnectedCallback");
        }

		//When the custom widget is updated, the Custom Widget SDK framework executes this function first
        onCustomWidgetBeforeUpdate(changedProperties) {
            console.log("onCustomWidgetBeforeUpdate");
            this._props = {
                ...this._props,
                ...changedProperties
            };
        }

		//When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
        onCustomWidgetAfterUpdate(changedProperties) {

            console.log("onCustomWidgetAfterUpdate");
            console.log(changedProperties);

            if ("value" in changedProperties) {
                console.log("value:" + changedProperties["value"]);
                this.$value = changedProperties["value"];
            }

            if ("formula" in changedProperties) {
                console.log("formula:" + changedProperties["formula"]);
                this.$formula = changedProperties["formula"];

            }

            console.log("firsttime: " + this._firstConnection);
            var that = this;

            if (this._firstConnection === 0) {
                const div = document.createElement('div');
                let divid = changedProperties.widgetName;
                this._tagContainer = divid;
                div.innerHTML = '<div id="container_' + divid + '"></div>';
                shadowRoot.appendChild(div);

                const css = document.createElement('div');
                css.innerHTML = '<style>#container_' + divid + ' {width: 100%; height: 500px;}</style>'
                shadowRoot.appendChild(css);

                var mapcanvas_divstr = shadowRoot.getElementById('container_' + divid);
                console.log(mapcanvas_divstr);
                Ar.push({
                    'id': divid,
                    'div': mapcanvas_divstr,
                    'value': this.$value,
                    'formula': this.$formula,
                });

				async function LoadLibs() {
					try {
//						await loadScript(googlesheetsjs);
						await loadScript(amchartscorejs);				
						await loadScript(amchartschartsjs);				
						await loadScript(amchartsanimatedjs);
					} catch (e) {
						alert(e);
					} finally {
						Draw(Ar, that._firstConnection);
						that._firstConnection = 1;
					}
				}
				LoadLibs();
				

            } else {
                var id = this.$value.split("|")[0];
                console.log("id: " + id);

                var value = this.$value.split("|")[1];
                console.log("value: " + value);

                var formula = this.$formula;
                console.log("formula: " + formula);

                if (value !== "") {
                    var foundIndex = Ar.findIndex(x => x.id == id);
                    console.log("foundIndex: " + foundIndex);

                    if (foundIndex !== -1) {
                        console.log(Ar[foundIndex].div);
//                        GoogleSheets(Ar[foundIndex].div, value, formula, id, this._firstConnection);
						Amchart(id, Ar[foundIndex].div, "", "", this._firstConnection)
                    }
                }
            }
        }

		//When the custom widget is removed from the canvas or the analytic application is closed
        onCustomWidgetDestroy() {
			console.log("onCustomWidgetDestroy");
        }
    }
    customElements.define("com-fd-amchartsgauge", Box);
})();