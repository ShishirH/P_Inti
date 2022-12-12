initYPositionEyes = 50
svgWidth = window.innerWidth * 0.6
svgHeight = window.innerHeight
var cooccurrenceView = {
    init: function(user) {
      var self = this;
      $("#proximityBars").empty()
      $("#wlanBars").empty()
      $("#sequenceView").empty()
      $("#mainDivTop").css("height", 0.5 * svgHeight)
      body = d3.select("#proximityBars");
      svgProximity = body.append('svg').attr('height',2000).attr('width', 1300).style("float", "left");
      body = d3.select("#wlanBars");
      svgWlan = body.append('svg').attr('height',2000).attr('width', 1300).style("float", "left");
      body = d3.select("#sequenceView");
      svgSequence = body.append('svg').attr('height',2000).attr('width', 1300).style("float", "left");
      // body = d3.select("#hourlySummary");
      // hourlySummary = body.append('svg').attr('height',2000).attr('width', 1300).style("float", "left");
      $.ajax({
        url: "/getWlanSummary",
        type: "get",
        data: {user: user},
        success: function(response) {
          wlanData = JSON.parse(response)
          console.log(wlanData)
          // self.makeSummaryViews(wlanData['proximitySummary'], wlanData['wlanSummary'], svgProximity, svgWlan, user)
          // self.makeSequences(wlanData['topSequences'], svgSequence)
          // self.makecooccurrenceViews(wlanData['cooccurrenceSummary'], svgProximity, svgWlan)
        },
        error: function(xhr) {
        }
      });
    },
    getRelationshipData: function (healthData, svg){
      var self = this;
      
    },
    makeSequences: function (topSequences, svg){
      var self = this;
      for (g = 0; g < topSequences.length; g++){
        // console.log(topSequences[g])
        for (r = 0; r < topSequences[g][1].length; r++){
          svg.append("circle")
              .attr("cx", 100 * r)
              .attr("cy",45 +  g * 25)
              .attr("r",7)
              .attr("fill", "#737373")
          text = svg.append('text')
                    .text(topSequences[g][1][r])
                    .attr('x', 100 * r)
                    .attr('y', 59 +  g * 25)
                    .style('font-size', "12px")
                    .attr('stroke', "#737373")
          if (r + 1 != topSequences[g][1].length){
            var circle = svg.append("line")
                             .attr("x1", 100 * r + 15)
                             .attr("y1", 45 +  g * 25)
                             .attr("x2", 100 * r + 70)
                             .attr("y2", 45 +  g * 25)
                             .attr('stroke', "#737373");
          }
        }
      }
    },
    makeSummaryViews: function (proximityData, wlanData, svgProximity, svgWlan, user){
      var self = this;
      wlanRows = 0
      proximityRows = 0
      for (g = 0; g < proximityData.length; g++){
        rect = svgProximity.append('rect')
                  .attr('width', 40)
                  .attr('height',50)
                  .attr('x',45 * (g%6)  + 45)
                  .attr('y',65 * proximityRows  + 65)
                  .attr("class", "proximity_bars")
                  .attr("user", user)
                  .attr("id", "proximity_bars_" + proximityData[g]["user"])
                  .attr("proximityID" ,proximityData[g]["user"])
                  .style('fill', "#fc8d59")
                  .on("mouseover", function(d, i) {
                      wlanID = this.getAttribute("proximityID");
                      $(".wlan_bars").hide()
                      $(".wlan_cooccurrence_" + wlanID).show()
                    })
                    .on("mouseout", function(d, i) {
                      wlanID = this.getAttribute("proximityID");
                      $(".wlan_bars").show()
                      $(".wlan_cooccurrence_" + wlanID).hide()
                    })
                    .on("click", function(d, i) {
                      user = this.getAttribute("user");
                      proximityID = this.getAttribute("proximityID");
                      $.ajax({
                        url: "/getHourlySummary",
                        type: "get",
                        data: {user: user,
                               typeSensor: "proximity"},
                        success: function(response) {
                          hourlySummary = JSON.parse(response)
                          // console.log(hourlySummary)
                          self.makeHourlySummaries(hourlySummary, proximityID)
                        },
                        error: function(xhr) {
                        }
                      });
                    });
        text = svgProximity.append('text')
                  .text(proximityData[g]["user"])
                  .attr('x', 45 * (g%6) + 45)
                  .attr('y', 65 * proximityRows + 65)
                  .style('font-size', "12px")
                  .attr('stroke', "#737373")
        if ( (g +1) % 6 == 0 && g != 0){
          proximityRows += 1
        }
      }

      for (g = 0; g < wlanData.length; g++){
        rect = svgWlan.append('rect')
                  .attr('width', 40)
                  .attr('height',50)
                  .attr('x', 45 * (g%6) + 45)
                  .attr('y',65 * wlanRows  + 65)
                  .attr("class", "wlan_bars")
                  .attr("user", user)
                  .attr("id", "wlan_bars_" + wlanData[g]["user"])
                  .attr("wlanID", wlanData[g]["user"])
                  .style('fill', "#fc8d59")
                  .on("mouseover", function(d, i) {
                      wlanID = this.getAttribute("wlanID");
                      $(".proximity_bars").hide()
                      $(".proximity_cooccurrence_" + wlanID).show()
                    })
                    .on("mouseout", function(d, i) {
                      wlanID = this.getAttribute("wlanID");
                      $(".proximity_bars").show()
                      $(".proximity_cooccurrence_" + wlanID).hide()
                    })
                    .on("click", function(d, i) {
                      user = this.getAttribute("user");
                      wlanID = this.getAttribute("wlanID");
                      $.ajax({
                        url: "/getHourlySummary",
                        type: "get",
                        data: {user: user,
                               typeSensor: "wlan"},
                        success: function(response) {
                          hourlySummary = JSON.parse(response)
                          // console.log(hourlySummary)
                          self.makeHourlySummaries(hourlySummary, wlanID)
                        },
                        error: function(xhr) {
                        }
                      });
                    });;
        text = svgWlan.append('text')
                  .text(wlanData[g]["user"])
                  .attr('x', 45 * (g%6) + 45)
                  .attr('y', 65 * wlanRows + 65)
                  .style('font-size', "12px")
                  .attr('stroke', "#737373")
        if ((g + 1)% 6 == 0 && g != 0){
          wlanRows += 1
        }
      }
    },
    makecooccurrenceViews: function (cooccurrenceData, svgProximity, svgWlan){
      var self = this;
      for (h = 0 ; h < cooccurrenceData.length; h++){
        pair = cooccurrenceData[h].split(": ")[0]
        type = cooccurrenceData[h].split(": ")[0].split("-")[2]
        value = parseFloat(cooccurrenceData[h].split(": ")[1])
        if (type === "wlan"){
          rect = svgProximity.append('rect')
                  .attr('width', 40)
                  .attr('height',50 * value)
                  .attr('x',$("#proximity_bars_" + pair.split("-")[0]).attr("x"))
                  .attr('y',parseFloat($("#proximity_bars_" + pair.split("-")[0]).attr("y"))  + (50 - (50 * value)))
                  .attr("class", "promity_cooccurrence_" + pair.split("-")[1])
                  .style('fill', "#80b1d3")
                  .style('display', 'none')

        } else{
          rect = svgWlan.append('rect')
                  .attr('width', 40)
                  .attr('height',50 * value)
                  .attr('x',$("#wlan_bars_" + pair.split("-")[1]).attr("x"))
                  .attr('y',parseFloat($("#wlan_bars_" + pair.split("-")[1]).attr("y"))  + (50 - (50 * value)))
                  .attr("class", "wlan_cooccurrence_" + pair.split("-")[0])
                  .style('fill', "#80b1d3")
                  .style('display', 'none')
        }
      }
    },
    makeHourlySummaries: function(hourlySummary, barID){
      var self = this;
      $("#hourlySummary").empty()
      var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 400 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;
      var parseTime = d3.timeParse("%d-%b-%y");
      var x = d3.scaleLinear().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);
      var y1 = d3.scaleLinear().range([height, 0]);
      var valueline = d3.line()
          .x(function(d) { return x(d.hour); })
          .y(function(d) { return y(d.ratio); });
      var valueline1 = d3.line()
          .x(function(d) { return x(d.hour); })
          .y(function(d) { return y(d.count); });
      var svg = d3.select("#hourlySummary").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      daySummary = []
      for (var key in Object(hourlySummary[barID])){
        daySummary.push ({"hour": key, "ratio": hourlySummary[barID][key]['ratio']})
      }
      daySummaryCount = []
      for (var key in Object(hourlySummary[barID])){
        daySummaryCount.push ({"hour": key, "count": hourlySummary[barID][key]['count']})
      }
      daySummary.forEach(function(d) {
          d.hour = +d.hour;
      });
      daySummaryCount.forEach(function(d) {
          d.count = +d.count;
      });
      x.domain([0,23]);
      y.domain([0, 1]);
      y1.domain([0, d3.max(daySummaryCount, function(d) { return d.count; })]);
      svg.append("path")
          .data([daySummary])
          .attr("class", "line")
          .attr("d", valueline)
          .attr('stroke', "#737373");
      svg.append("path")
          .data([daySummaryCount])
          .attr("class", "line")
          .attr("d", valueline1)
          .attr('stroke', "#123456");
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
      svg.append("g")
          .call(d3.axisRight(y));
      svg.append("g")
          .attr("transform", "translate( " + width + ", 0 )")
          .call(d3.axisRight(y1));
    }
}