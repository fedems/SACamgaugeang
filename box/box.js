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

	//https://apis.google.com/js/api.js
    //const googlesheetsjs = "https://fedems.github.io/SACamcharts/box/api.js";
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

        var data = {};
        if (value !== "") {
            data = JSON.parse(value);
            console.log(data);
        }


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
                  title: "Unsustainable",
                  color: "#ee1f25",
                  lowScore: -100,
                  highScore: -20
                },
                {
                  title: "Volatile",
                  color: "#f04922",
                  lowScore: -20,
                  highScore: 0
                },
                {
                  title: "Foundational",
                  color: "#fdae19",
                  lowScore: 0,
                  highScore: 20
                },
                {
                  title: "Developing",
                  color: "#f3eb0c",
                  lowScore: 20,
                  highScore: 40
                },
                {
                  title: "Maturing",
                  color: "#b0d136",
                  lowScore: 40,
                  highScore: 60
                },
                {
                  title: "Sustainable",
                  color: "#54b947",
                  lowScore: 60,
                  highScore: 80
                },
                {
                  title: "High Performing",
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
            chart.fontSize = 11;
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
            label.fontSize = "6em";
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
            
            setInterval(function() {
                var value = chartMin + Math.random() * (chartMax - chartMin);
                hand.showValue(value, 1000, am4core.ease.cubicOut);
            }, 2000);
		  } 
          else {            	
            	var foundIndex = Ar.findIndex(x => x.id == id);
    			console.log("foundIndex drawChart: " + foundIndex);
    			ArChartGauge[foundIndex].chart.data = data;
            }

    };

//    // Google Sheets
//    function GoogleSheets(divid, text_val, formula_val, id, firsttime) {
//
//        /**
//        *  Initializes the API client library and sets up sign-in state
//        *  listeners.
//        */
//        function initClient() {
//            var API_KEY = ''; // TODO: Update placeholder with desired API key.
//            var CLIENT_ID = ''; // TODO: Update placeholder with desired client ID.
//
//            // TODO: Authorize using one of the following scopes:
//            //   'https://www.googleapis.com/auth/drive'
//            //   'https://www.googleapis.com/auth/drive.file'
//            //   'https://www.googleapis.com/auth/spreadsheets'
//            var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
//
//            gapi.client.init({
//                'apiKey': API_KEY,
//                'clientId': CLIENT_ID,
//                'scope': SCOPE,
//                'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
//            }).then(function() {
//                // Listen for sign-in state changes.
//                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
//                // Handle the initial sign-in state.
//                updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
//            });
//        }
//
//
//        function makeApiCall_Get() {
//            var params = {
//                // The ID of the spreadsheet to retrieve data from.
//                spreadsheetId: '1tdoEu_1D-0-k2pJJGqfdS7-no1Jk_AEX1KjqC0R4GSI', // TODO: Update placeholder value.
//
//                // The A1 notation of the values to retrieve.
//                range: 'Data!B:C', // TODO: Update placeholder value.
//
//                // How values should be represented in the output.
//                // The default render option is ValueRenderOption.FORMATTED_VALUE.
//                valueRenderOption: 'FORMATTED_VALUE', // TODO: Update placeholder value.
//
//                // How dates, times, and durations should be represented in the output.
//                // This is ignored if value_render_option is
//                // FORMATTED_VALUE.
//                // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
//                dateTimeRenderOption: 'FORMATTED_STRING', // TODO: Update placeholder value.
//            };
//
//            var request = gapi.client.sheets.spreadsheets.values.get(params);
//            request.then(function(response) {
//                // TODO: Change code below to process the `response` object:
//                console.log(response.result.values);
//
//				if (typeof response.result.values !== 'undefined') {
//					var arraydata = [];
//					if (response.result.values.length > 0) {
//						for (i = 1; i < response.result.values.length; i++) {
//							//console.log(response.result.values[i]);
//							arraydata.push({
//								"date": response.result.values[i][0],
//								"value": response.result.values[i][1]
//							});
//						}
//					}
//					console.log(arraydata);
//					Amchart(id, divid, JSON.stringify(arraydata), formula_val, firsttime);
//				}
//
//            }, function(reason) {
//                console.error('error: ' + reason.result.error.message);
//            });
//        }
//
//        function makeApiCall_BatchUpdate() {
//            var params = {
//                // The ID of the spreadsheet to update.
//                spreadsheetId: '1tdoEu_1D-0-k2pJJGqfdS7-no1Jk_AEX1KjqC0R4GSI', // TODO: Update placeholder value.
//            };
//
//            var batchUpdateValuesRequestBody = {
//                // How the input data should be interpreted.
//                valueInputOption: 'USER_ENTERED', // TODO: Update placeholder value.
//
//                // The new values to apply to the spreadsheet.
//                data: [{
//                        "majorDimension": "ROWS",
//                        "range": "Data!A1",
//                        "values": [
//                            [
//                                text_val
//                            ]
//                        ]
//                    },
//                    {
//                        "majorDimension": "ROWS",
//                        "range": "Data!B1",
//                        "values": [
//                            [
//                                formula_val
//                            ]
//                        ]
//                    }
//                ] // TODO: Update placeholder value.
//                // TODO: Add desired properties to the request body.
//            };
//
//            var request = gapi.client.sheets.spreadsheets.values.batchUpdate(params, batchUpdateValuesRequestBody);
//            request.then(function(response) {
//                // TODO: Change code below to process the `response` object:
//                console.log(response.result);
//                makeApiCall_Get();
//            }, function(reason) {
//                console.error('error: ' + reason.result.error.message);
//            });
//        }
//
//
//        function handleClientLoad() {
//            gapi.load('client:auth2', initClient);
//        }
//
//        /**
//        *  Called when the signed in status changes, to update the UI
//        *  appropriately. After a sign-in, the API is called.
//        */
//        function updateSignInStatus(isSignedIn) {
//            if (isSignedIn) {
//                makeApiCall_BatchUpdate();
//            }
//        }
//
//        function handleSignInClick(event) {
//            gapi.auth2.getAuthInstance().signIn();
//        }
//
//        function handleSignOutClick(event) {
//            gapi.auth2.getAuthInstance().signOut();
//        }
//
//        handleClientLoad();
//    }; 

    function Draw(Ar, firsttime) {
        for (var i = 0; i < Ar.length; i++) {
//            GoogleSheets(Ar[i].div, Ar[i].value, Ar[i].formula, Ar[i].id, firsttime);
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
    customElements.define("com-fd-googlesheetsstock", Box);
})();
