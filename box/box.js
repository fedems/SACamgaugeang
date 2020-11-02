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
    const amchartscorejs = "https://fedems.github.io/SACamgaugeang/box/core.js";
    //https://www.amcharts.com/lib/4/charts.js
    const amchartschartsjs = "https://fedems.github.io/SACamgaugeang/box/charts.js";
    //https://www.amcharts.com/lib/4/themes/animated.js
    const amchartsanimatedjs = "https://fedems.github.io/SACamgaugeang/box/animated.js";

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
            
            // create chart
            var chart = am4core.create(divid, am4charts.GaugeChart);
            chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

            chart.innerRadius = -25;

            var axis = chart.xAxes.push(new am4charts.ValueAxis());
            axis.min = 0;
            axis.max = 100;
            axis.strictMinMax = true;
            axis.renderer.grid.template.stroke = new am4core.InterfaceColorSet().getFor("background");
            axis.renderer.grid.template.strokeOpacity = 0.3;

            var colorSet = new am4core.ColorSet();

            var range0 = axis.axisRanges.create();
            range0.value = 0;
            range0.endValue = 50;
            range0.axisFill.fillOpacity = 1;
            range0.axisFill.fill = colorSet.getIndex(0);
            range0.axisFill.zIndex = - 1;

            var range1 = axis.axisRanges.create();
            range1.value = 50;
            range1.endValue = 80;
            range1.axisFill.fillOpacity = 1;
            range1.axisFill.fill = colorSet.getIndex(2);
            range1.axisFill.zIndex = -1;

            var range2 = axis.axisRanges.create();
            range2.value = 80;
            range2.endValue = 100;
            range2.axisFill.fillOpacity = 1;
            range2.axisFill.fill = colorSet.getIndex(4);
            range2.axisFill.zIndex = -1;

            var hand = chart.hands.push(new am4charts.ClockHand());

            // using chart.setTimeout method as the timeout will be disposed together with a chart
            chart.setTimeout(randomValue, 2000);

            function randomValue() {
                hand.showValue(Math.random() * 100, 1000, am4core.ease.cubicOut);
                chart.setTimeout(randomValue, 2000);
            }
        
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
    customElements.define("com-fd-amchartsgaugeang", Box);
})();