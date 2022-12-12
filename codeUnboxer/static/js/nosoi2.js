svgWidth = window.innerWidth 
svgHeight = window.innerHeight
// var heatMapColors = ["rgb(103,0,31)",
// "rgb(178,24,43)",
// "rgb(214,96,77)",
// "rgb(244,165,130)",
// "rgb(253,219,199)",
// "rgb(247,247,247)",
// "rgb(209,229,240)",
// "rgb(146,197,222)",
// "rgb(67,147,195)",
// "rgb(33,102,172)",
// "rgb(5,48,97)"]

var heatMapColors = ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]
var similarityColors = ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]
var lifestyle = ["children","roomates","incomesLevels_Less","incomesLevels_49999","incomesLevels_99999",
        "incomesLevels_124999","incomesLevels_125000","incomesLevels_More","employment_full","employment_part","employment_Student",
        "employment_Retired","employment_Care","employment_unemployed" ,"shift_Morning"    ,"shift_Afternoon" ,"shift_Overnight" 
        ,"athletics_No"    ,"athletics_Yes"   ,"marital_Married" ,"marital_Divorced"    ,"marital_Single"  ,"marital_Separated"   ,"marital_Widowed" ]
var physical = ["age","height","weight","chronicSimplified","activityLevels_Sedentary","activityLevels_Lightly","activityLevels_3 times","activityLevels_Very",
        "gender_Male", "gender_Female",   "gender_Non", "hand_Right",   "hand_Left",   "hand_Ambidextrous" ]
var populationLevelAnalysis = {
  init: function() {
    var self = this;
    self.makeFeatureTiles ()
    $.ajax({
      url: "/makeCohortSummary",
      type: "get",
      data: {},
      success: function(response) {
        cohortSummary =  $.parseJSON(response)
        self.makeCohortSummaryView(cohortSummary)
        self.makeCohortDayDistributionView()
        self.makeUserClustersView()
        self.makeFeatsSummaryView()
        self.makeSavedModelsView()
        $("#loadingGif").hide()
      },
      error: function(xhr) {
      }
    });
    $('#similarity').on('change', function() {
      // alert( this.value );
      
    });

    $('#projection').on('change', function() {
      
      $("#currentlySelectedReduction").text(this.value)
      $.ajax({
        url: "/makeCohortSummary",
        type: "get",
        data: {},
        success: function(response) {
          cohortSummary =  $.parseJSON(response)
          self.makeCohortSummaryView(cohortSummary)
          self.makeCohortDayDistributionView()
          self.makeUserClustersView()
          self.makeFeatsSummaryView()
          $("#loadingGif").hide()
        },
        error: function(xhr) {
        }
      });
    });
    $('#clustering').on('change', function() {
      $("#currentlySelectedClustering").text(this.value)
      
    });

    $('#k').on('change', function() {
      $("#currentlySelectedK").text(this.value)
      
    });

    $('#mlButton').on('click', function() {
      self.makeMachineLearningView($("#currentlySelectedUsers").text(), $("#algorithm").val(), $("#wellness").val() );
    });

  },
  remakeAllViews : function(feats ){
    var self = this
    k=  $("#currentlySelectedK").text()
    clustering=  $("#currentlySelectedClustering").text()
    projection=  $("#currentlySelectedReduction") .text()
    $("#loadingGif").show()
    $.ajax({
      url: "/clusteringUsers",
      type: "get",
      data: {similarity:feats , k: k, clustering: clustering, projection: projection},
      success: function(response) {
        cohortSummary =  $.parseJSON(response)
        self.makeCohortSummaryView(cohortSummary)
        self.makeCohortDayDistributionView()
        self.makeUserClustersView()
        self.makeFeatsSummaryView()
        $("#loadingGif").hide()
      },
      error: function(xhr) {
      }
    });
  },
  makeFeatureTiles : function(){
    var self = this;
    var body = d3.select("#controlPanel")
    var controlPanel = body.append('svg').attr('height',300).attr('width', 400).style("float", "left")
    text = controlPanel.append('text')
              .text("Similarity Metric")
              .attr('x', 10 )
              .attr('y', 25)
              .style('font-size', "24px")
              .attr('stroke', "#737373")
    rect = controlPanel.append('rect')
                       .attr('width',  100)
                       .attr('height', 25)
                       .attr('x',10)
                       .attr('y', 60)
                       .attr('id', "feats_all")
                       .attr('class', "featSelection feats_all" )
                       .attr('featSelection', 'all')
                       .style("fill", "white")
                       .style("stroke", "black")
                       .on("click", function(d, i) {
                            featSelection = $(this).attr("featSelection")
                            $(".featSelection").css('fill', 'white')
                            $("#feats_" +  featSelection).css("stroke", "black")
                            $("#feats_" +  featSelection).css("fill", "beige")
                            $("#currentlySelectedFeats").text(featSelection)
                            self.remakeAllViews(featSelection)
                        })
    text = controlPanel.append('text')
              .text("All")
              .attr('x', 40 )
              .attr('y', 80)
              .style('font-size', "20px")
              .attr('stroke', "#737373")
    rect = controlPanel.append('rect')
                       .attr('width',  100)
                       .attr('height', 25)
                       .attr('x',10)
                       .attr('y', 90)
                       .attr('id', "feats_physical")
                       .attr('class', "featSelection feats_physical" )
                       .attr('featSelection', 'physical')
                       .style("fill", "white")
                       .style("stroke", "black")
                       .on("click", function(d, i) {
                            featSelection = $(this).attr("featSelection")
                            if ($("#currentlySelectedFeats").text().includes(featSelection)){
                              $("#currentlySelectedFeats").text($("#currentlySelectedFeats").text().replace(featSelection, '') )
                              $("#feats_" +  featSelection).css("fill", "white")
                              self.remakeAllViews($("#currentlySelectedFeats").text())
                            } else if (!$("#currentlySelectedFeats").text().includes(featSelection)){
                              $("#feats_all" ).css("fill", "white")
                              if ($("#currentlySelectedFeats").text().includes("all")){
                                $("#currentlySelectedFeats").text($("#currentlySelectedFeats").text().replace("all", ""))
                              }
                              $("#currentlySelectedFeats").text($("#currentlySelectedFeats").text() + ',' + featSelection  )
                              $("#feats_" +  featSelection).css("fill", "beige")
                              self.remakeAllViews($("#currentlySelectedFeats").text())
                            }
                        })
    text = controlPanel.append('text')
              .text("Physical")
              .attr('x', 30 )
              .attr('y', 110)
              .style('font-size', "20px")
              .attr('stroke', "#737373")
    rect = controlPanel.append('rect')
                       .attr('width',  100)
                       .attr('height', 25)
                       .attr('x',120)
                       .attr('y', 90)
                       .attr('id', "feats_lifestyle")
                       .attr('class', "featSelection feats_lifestyle" )
                       .attr('featSelection', 'lifestyle')
                       .style("fill", "white")
                       .style("stroke", "black")
                       .on("click", function(d, i) {
                            featSelection = $(this).attr("featSelection")
                            if ($("#currentlySelectedFeats").text().includes(featSelection)){
                              $("#currentlySelectedFeats").text($("#currentlySelectedFeats").text().replace(featSelection, '') )
                              $("#feats_" +  featSelection).css("fill", "white")
                              self.remakeAllViews($("#currentlySelectedFeats").text())
                            } else if (!$("#currentlySelectedFeats").text().includes(featSelection)){
                              $("#feats_all" ).css("fill", "white")
                              if ($("#currentlySelectedFeats").text().includes("all")){
                                $("#currentlySelectedFeats").text($("#currentlySelectedFeats").text().replace("all", ""))
                              }
                              $("#currentlySelectedFeats").text($("#currentlySelectedFeats").text() + ',' + featSelection  )
                              $("#feats_" +  featSelection).css("fill", "beige")
                              self.remakeAllViews($("#currentlySelectedFeats").text())
                            }
                        })
    text = controlPanel.append('text')
              .text("Lifestyle")
              .attr('x', 130 )
              .attr('y', 110)
              .style('font-size', "20px")
              .attr('stroke', "#737373")
    rect = controlPanel.append('rect')
                       .attr('width',  100)
                       .attr('height', 25)
                       .attr('x',230)
                       .attr('y', 90)
                       .attr('id', "feats_sensor")
                       .attr('class', "featSelection feats_sensor" )
                       .attr('featSelection', 'sensor')
                       .style("fill", "white")
                       .style("stroke", "black")
                       .on("click", function(d, i) {
                            featSelection = $(this).attr("featSelection")
                            if ($("#currentlySelectedFeats").text().includes(featSelection)){
                              $("#currentlySelectedFeats").text($("#currentlySelectedFeats").text().replace(featSelection, '') )
                              $("#feats_" +  featSelection).css("fill", "white")
                              self.remakeAllViews($("#currentlySelectedFeats").text())
                            } else if (!$("#currentlySelectedFeats").text().includes(featSelection)){
                              $("#feats_all" ).css("fill", "white")
                              if ($("#currentlySelectedFeats").text().includes("all")){
                                $("#currentlySelectedFeats").text($("#currentlySelectedFeats").text().replace("all", ""))
                              }
                              $("#currentlySelectedFeats").text($("#currentlySelectedFeats").text() + ',' + featSelection  )
                              $("#feats_" +  featSelection).css("fill", "beige")
                              self.remakeAllViews($("#currentlySelectedFeats").text())
                            }
                        })
    text = controlPanel.append('text')
              .text("Sensor")
              .attr('x', 240 )
              .attr('y', 110)
              .style('font-size', "20px")
              .attr('stroke', "#737373")
  },
  makeCohortSummaryView: function(cohortSummary){
    var self = this;
    $("#cohortSummaryView").empty()
    var bodyPLS = d3.select("#pls")
    var cohortSummaryViewPLS = bodyPLS.append('svg').attr('height',30000).attr('width', 600).style("float", "left")
    var body = d3.select("#cohortSummaryView")
    var cohortSummaryView = body.append('svg').attr('height',30000).attr('width', 1800).style("float", "left")
    var keys = Object.keys(cohortSummary)
    console.log(cohortSummary)
    initY = 10
    text = cohortSummaryViewPLS.append('text')
              .text("P")
              .attr('x', 85 )
              .attr('y', 25)
              .style('font-size', "22px")
              .attr('stroke', "#737373")
    text = cohortSummaryViewPLS.append('text')
              .text("L")
              .attr('x', 135 )
              .attr('y', 25)
              .style('font-size', "22px")
              .attr('stroke', "#737373")
    text = cohortSummaryViewPLS.append('text')
              .text("S")
              .attr('x', 185 )
              .attr('y', 25)
              .style('font-size', "22px")
              .attr('stroke', "#737373")


    text = cohortSummaryViewPLS.append('text')
                  .text("Least Similar")
                  .attr('x', 280 )
                  .attr('y', 15)
                  .style('font-size', "12px")
                  .attr('stroke', "#737373")
                  .attr('class', "")
    text = cohortSummaryViewPLS.append('text')
              .text("Most Similar" )
              .attr('x', 245 + 210 )
              .attr('y', 15)
              .style('font-size', "12px")
              .attr('stroke', "#737373")
              .attr('class', "")
    for (y = 0; y < 9; y++){
      rect = cohortSummaryViewPLS.append('rect')
                 .attr('width', 20)
                 .attr('height', 10)
                 .attr('x',25 + (20 * y) + 280)
                 .attr('y', 20)
                 .style("fill", similarityColors[y])
    }

    for (q = 0; q < keys.length; q++){
      // console.log(keys[q])
      rect = cohortSummaryView.append('rect')
                       .attr('width',  499)
                       .attr('height', 150)
                       .attr('x',0)
                       .attr('y', initY)
                       .attr('id', "cohort_" + keys[q])
                       .attr('class', "cohorts cohort_" + keys[q])
                       .attr('cohort', keys[q])
                       .style("fill", "white")
                       .on("mouseover", function(d, i) {
                            cohort = $(this).attr("cohort")
                            $("#cohort_" +  cohort).css("fill", "beige")
                        })
                       .on("mouseout", function(d, i) {
                            cohort = $(this).attr("cohort")
                            if ($("#currentlySelectedCluster").text() !== cohort){
                              $("#cohort_" +  cohort).css("fill", "white")
                            }
                        })
                       .on("click", function(d, i) {
                            cohort = $(this).attr("cohort")
                            self.makeUserHypothesisView(null, cohort)
                            self.makeDemoView(null, cohort)
                            $("#selectedCohortSummaryView").hide()
                            $(".cohorts").css("stroke", "none")
                            $(".cohorts").css("fill", "white")
                            $("#cohort_" +  cohort).css("stroke", "black")
                            $("#cohort_" +  cohort).css("fill", "beige")
                            $("#currentlySelectedCluster").text(cohort)
                            self.makeUsersinClustersText(cohort)

                        })
      clusterFill = self.gettsneClusterColor(q)
      rect = cohortSummaryView.append('rect')
                       .attr('width',  40)
                       .attr('height', 20)
                       .attr('x',70)
                       .attr('y', initY + 3)
                       .style("fill", self.getSimilarityColor(cohortSummary[keys[q]]['physical']) )
                       // .style("opacity", cohortSummary[keys[q]]['physical'])
      rect = cohortSummaryView.append('rect')
                       .attr('width',  40)
                       .attr('height', 20)
                       .attr('x',120)
                       .attr('y', initY + 3)
                       .style("fill", self.getSimilarityColor(cohortSummary[keys[q]]['lifestyle']))
                       // .style("opacity", cohortSummary[keys[q]]['lifestyle'])
      rect = cohortSummaryView.append('rect')
                       .attr('width',  40)
                       .attr('height', 20)
                       .attr('x',170)
                       .attr('y', initY + 3)
                       .style("fill", self.getSimilarityColor(cohortSummary[keys[q]]['sensor']))
                       // .style("opacity", cohortSummary[keys[q]]['sensor'])
      var circle = cohortSummaryView.append("circle")
                                   .attr("cx",25 ) 
                                   .attr("cy", initY + 75)
                                   .attr("r", 15)
                                   .style("fill", clusterFill)
                                   .style("stroke", "black")
                                   // .style("opacity", "0.9")
                                   // .attr('writer', )
      text = cohortSummaryView.append('text')
              .text(cohortSummary[keys[q]]['count'])
              .attr('x', 10 )
              .attr('y', initY + 110 )
              .style('font-size', "18px")
              .attr('stroke', "#737373")
      var a = 0;
      for (var average in Object(cohortSummary[keys[q]])) {
        // console.log()
        if (!average.includes('completeness') && !average.includes('physical') && !average.includes('lifestyle') && !average.includes('sensor') && !average.includes('count')){
          self.makeCohortSummaryViewAverages(cohortSummaryView, initY, average, cohortSummary[keys[q]][average], a, cohortSummary[keys[q]][average + "_completeness"], 70)
          a += 1
        }
      }
      initY += 150
    }
  },
  makeCohortSummaryViewAverages: function(svg, initY, label, average, iter, completeness, initX){
    // console.log(average)
    text = svg.append('text')
              .text(label)
              .attr('x', initX)
              .attr('y', initY  + 45 + (iter * 30))
              .style('font-size', "18px")
              .attr('stroke', "#737373")
    rect = svg.append('rect')
              .attr('width',  140)
              .attr('height', 25)
              .attr('x',initX + 140)
              .attr('y', initY + 30 + (iter * 30))
              .style("fill", "#d9d9d9")
    rect = svg.append('rect')
              .attr('width',  140 * average)
              .attr('height', 13)
              .attr('x',initX + 140)
              .attr('y', initY + 36 + (iter * 30))
              .style("fill", "#737373")
    rect = svg.append('rect')
              .attr('width',  140 * completeness)
              .attr('height', 6)
              .attr('x',initX + 140)
              .attr('y', initY + 39.5 + (iter * 30))
              .style("fill", "#000000")
  },
  makeCohortDayDistributionView: function(){
    var self = this;
    $.ajax({
      url: "/makeCohortDayDistribution",
      type: "get",
      data: {},
      success: function(response) {
        cohortDayDistributions =  $.parseJSON(response)
        $("#cohortDayDistributionView").empty()
        var body = d3.select("#cohortDayDistributionView")
        var cohortDayDistributionView = body.append('svg').attr('height',30000).attr('width', 1800).style("float", "left")
        var cohorts = Object.keys(cohortDayDistributions)
        initY = 50;

        for (k = 0; k < cohortDayDistributions[cohorts[0]].length; k++){
          // rect = cohortDayDistributionView.append('rect')
          //              .attr('width',  80)
          //              .attr('height', 550)
          //              .attr('x', 80 + (80 * k))
          //              .attr('y', 5)
          //              .attr('class', "days days_" + "D" + k)
          //              .attr('day', "D" + k)
          //              .style("fill", "white")
          //              .on("mouseover", function(d, i) {
          //                   day = $(this).attr("day")
          //                   $(".days_" +  day).css("fill", "beige")
          //                   $(".daysFeats_" +  day).css("fill", "beige")
          //                   $(".daysFeats_" +  day).css("stroke", "black")
          //                   $(".daysFeats_" +  day).css("stroke-width", "4")
          //               })
          //              .on("mouseout", function(d, i) {
          //                   day = $(this).attr("day")
          //                   $(".days" ).css("fill", "white")
          //                   $(".days" ).css("stroke-width", "0")
          //               })
          text = cohortDayDistributionView.append('text')
              .text("D" + k)
              .attr('x', 110 + (60 * k) )
              .attr('y', 20 )
              .style('font-size', "18px")
              .attr('stroke', "#737373")
        }
        for (j = 0; j < cohorts.length; j++){
          clusterFill = self.gettsneClusterColor(j)
          var circle = cohortDayDistributionView.append("circle")
                                       .attr("cx",50 ) 
                                       .attr("cy", initY - 5 )
                                       .attr("r", 15)
                                       .style("fill", clusterFill)
                                       .style("stroke", "black")
                                       .style("opacity", "0.9")
          distributions = cohortDayDistributions[cohorts[j]]
          cohortDayDistributionView.append("line")         
              .style("stroke", "black") 
              .attr("x1", 120 )   
              .attr("y1", initY - 5)     
              .attr("x2", 120 + (cohortDayDistributions[cohorts[0]].length -1) * 60)   
              .attr("y2", initY - 5);
          for (k = 0; k < distributions.length; k++){
            var circle = cohortDayDistributionView.append("circle")
                           .attr("cx", 120 + (60 * k)) 
                           .attr("cy", initY - 5 )
                           .attr("r", 10 * (distributions[k]) )
                           .style("fill", "#f0f8ff")
                           .style("stroke", "black")
          }
          initY += 40
        }
      },
      error: function(xhr) {
      }
    });
  },
  makeUserClustersView : function(){
    var self = this;
    $.ajax({
      url: "/getUserClusters",
      type: "get",
      data: {},
      success: function(response) {
        userClusters =  $.parseJSON(response)
        // console.log(userClusters)
        $("#userClustersView").empty()
        var body = d3.select("#userClustersView")
        var userClustersView = body.append('svg').attr('height',30000).attr('width', 1800).style("float", "left")
        for (r = 0; r < userClusters['points'].length; r++){
          clusterFill = self.gettsneClusterColor(userClusters['points'][r]['cluster_label'] )
          // console.log("xpoint: " +  (userClusters['maxY'] - userClusters['minY']) )
          var circle = userClustersView.append("circle")
                                   .attr("cx", 10 + ((userClusters['points'][r]['xPoint'] - userClusters['minX']) /  (userClusters['maxX'] - userClusters['minX'])) * 1050) 
                                   .attr("cy", 20 + ((userClusters['points'][r]['yPoint'] - userClusters['minY']) /  (userClusters['maxY'] - userClusters['minY']) )* 550)
                                   .attr("r", 5)
                                   .attr('writer', userClusters['points'][r]['writer'])
                                   .attr("class", "allCircles circle_" + userClusters['points'][r]['writer'])
                                   .style("fill", clusterFill)
                                   .style("stroke", "black")
                                   .style("opacity", "0.5")
        }

        // $("#enableBrush").on('change', function() {
        //   if ($("#enableBrush").is(":checked")){
            var svg =  d3.select("#clusterView").select("svg")
            var brush = d3.brush()
            .extent([[0, 0], [14000, 3050]])
            .on("brush", brushed)
            .on("end", brushended);
            function isBrushed(brush_coords, cx, cy) {
              var x0 = brush_coords[0][0],
                   x1 = brush_coords[1][0],
                   y0 = brush_coords[0][1],
                   y1 = brush_coords[1][1];
              return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
            }
            function brushed() {  
               var e = brush.extent();
            }
            function brushended(){
              var selection = d3.event.selection;
              allRects = userClustersView.selectAll('circle');
              var brush_coords = d3.brushSelection(this);
              filtered =  allRects.filter(function (){
                   var cx = d3.select(this).attr("cx"),
                       cy = d3.select(this).attr("cy");
                   return isBrushed(brush_coords, cx, cy);
              }) 
              // console.log(filtered)
              self.makeUserHypothesisView(filtered, 20)


              var filteredUsers = []
              for (n = 0; n < filtered['_groups'][0].length; n++){
                filteredUsers.push(filtered['_groups'][0][n]['attributes']['writer'].value)
                // console.log(filtered['_groups'][0][n]['attributes']['writer'].value)
              }
              // console.log(filteredUsers.toString())
              $("#currentlySelectedUsers").text(filteredUsers.toString())
              $("#currentlySelectedUsersNumber").text(filteredUsers.toString().split(",").length)
              $.ajax({
                  url: "/getDaysInCohort",
                  type: "get",
                  data: { "users": filteredUsers.toString()},
                  success: function(response) {
                    $("#currentlySelectedNumOfDays").text(response)
                  },
                  error: function(xhr) {
                  }
              });
              self.makeDemoView(filteredUsers, null)
            }
            userClustersView.call(brush)
          // } 
          // else{
          //   $(".overlay").remove()
            
          // }
        // });
      },
      error: function(xhr) {
      }
    });
  },
  makeFeatsSummaryView: function(){
    var self = this;
    $("#daysHeatmap").empty()
    var body = d3.select("#daysHeatmap");
    var svgFeatSummary = body.append('svg').attr('height',30000).attr('width', 1800).style("float", "left").attr('id', "svgFeatSummary");
    text = svgFeatSummary.append('text')
                  .text("Low")
                  .attr('x', 10  + 450 )
                  .attr('y', 23)
                  .style('font-size', "12px")
                  .attr('stroke', "#737373")
                  .attr('class', "")
    text = svgFeatSummary.append('text')
              .text("High" )
              .attr('x', 205 + 450 )
              .attr('y', 23)
              .style('font-size', "12px")
              .attr('stroke', "#737373")
              .attr('class', "")
    for (y = 0; y < 9; y++){
      rect = svgFeatSummary.append('rect')
                 .attr('width', 20)
                 .attr('height', 10)
                 .attr('x',25 + (20 * y) + 450)
                 .attr('y',5 + 30)
                 .style("fill", heatMapColors[y])
    }
    $.ajax({
      url: "/getFeaturesSummary",
      type: "get",
      data: {},
      success: function(response) {
        featuresSummary =  $.parseJSON(response)
        var days = Object.keys(featuresSummary['featDists'])
        initX = 180
        initYLabels = 125;
        for (var j = 0; j < featuresSummary['feats'].length; j++){
          text = svgFeatSummary.append('text')
              .text(featuresSummary['feats'][j])
              .attr("text-anchor", "end")
              .attr('x', 170 )
              .attr('y', initYLabels + j * 20)
              .style('font-size', "12px")
              .attr('stroke', "#737373")
              .attr('class', "")
        }
        for (var i = 0; i < days.length; i++){
          
          rect = svgFeatSummary.append('rect')
                       .attr('width',  40)
                       .attr('height', 480)
                       .attr('x',initX + (i * 40))
                       .attr('y', 60)
                       .style("fill","none" )
                       .attr('class', "days daysFeats_" + days[i])
                       .attr('stroke', "#737373")
                       .attr('stroke-width', "0")
                       .attr("id", "featureDist_" + days[i])
          text = svgFeatSummary.append('text')
              .text(days[i])
              .attr('x', initX + (i * 40) + 15 )
              .attr('y', 80)
              .style('font-size', "14px")
              .attr('stroke', "#737373")
              .attr('class', "")
          var initY = 100 
          for (j = 0; j < featuresSummary['feats'].length; j++){
            rect = svgFeatSummary.append('rect')
                       .attr('width',  40)
                       .attr('height', 20)
                       .attr('x',initX + (i * 40))
                       .attr('y', initY)
                       .style("fill",heatMapColors[featuresSummary['featDists'][days[i]][featuresSummary['feats'][j]]])
            initY += 20
          }
        }
      },
      error: function(xhr) {
      }
    });

  },
  makeUserHypothesisView: function(filteredUsers, cohort ){
    var self = this;
    $("#selectedCohortSummaryView").empty()
    var svgFeatSummary = d3.select("#svgFeatSummary");
    
    var body = d3.select("#selectedCohortSummaryView");
    var svgHypothesisView = body.append('svg').attr('height',30000).attr('width', 400).style("float", "left");
    $.ajax({
      url: "/getHypothesisData",
      type: "get",
      data: {"cluster": "q"},
      success: function(response) {
        hypothesisData =  $.parseJSON(response)
        var days = Object.keys(hypothesisData['featDists'])
        // console.log(hypothesisData)
        var hypotheses = Object.keys(hypothesisData['hypothesisDists'])
        initX = 650
        initYLabels = 125;
        clusterFill = "grey"
        if (cohort != 20){
          // console.log(cohort)
          clusterFill = self.gettsneClusterColor(parseInt(cohort.replace("C", "")))
        }
        // var circle = svgFeatSummary.append("circle")
        //                            .attr("cx",initX + 15 ) 
        //                            .attr("cy", 70)
        //                            .attr("r", 15)
        //                            .style("fill", clusterFill)
        //                            .style("stroke", "black")
        // var initY = 100 
        // for (j = 0; j < hypothesisData['feats'].length; j++){
        //   rect = svgFeatSummary.append('rect')
        //              .attr('width',  40)
        //              .attr('height', 20)
        //              .attr('x',initX )
        //              .attr('y', initY)
        //              .style("fill",heatMapColors[hypothesisData['featDists'][hypothesisData['feats'][j] ]])
        //   initY += 20
        // }
        // initX = 690
        // for (var i = 0; i < hypotheses.length; i++){

        //   text = svgFeatSummary.append('text')
        //       .text(hypotheses[i])
        //       .attr('x', initX + (i * 40) + 15 )
        //       .attr('y', 80)
        //       .style('font-size', "14px")
        //       .attr('stroke', "#737373")
        //       .attr('class', "")
        //   var initY = 100 
        //   for (j = 0; j < hypothesisData['feats'].length; j++){
        //     fill = "#d9d9d9"
        //     if (hypothesisData['hypothesisDists'][hypotheses[i]][hypothesisData['feats'][j] ]){
        //       fill = "#252525"
        //     }

        //     rect = svgFeatSummary.append('rect')
        //                .attr('width',  40)
        //                .attr('height', 20)
        //                .attr('x',initX + (i * 40))
        //                .attr('y', initY)
        //                .style("fill",fill)
        //     initY += 20
        //   }
        // }
      },
      error: function(xhr) {
      }
    });
    if (filteredUsers !== null){
      $("#selectedCohortSummaryView").show()
      listOfUsers = []
      
      for (i = 0; i < filteredUsers['_groups'][0].length; i++){
        if (filteredUsers['_groups'][0][i]['attributes']['writer']){
        // console.log(filteredUsers['_groups'][0][i]['attributes'])
            listOfUsers.push(filteredUsers['_groups'][0][i]['attributes']['writer'].value)
        }
      }
      $.ajax({
        url: "/getFilteredData",
        type: "get",
        data: {"listOfUsers": listOfUsers.toString()},
        success: function(response) {
          filteredUsersSummary =  $.parseJSON(response)
          var keys = Object.keys(filteredUsersSummary)
          // console.log(filteredUsersSummary)
          initY = 10
          initX = 70
          for (q = 0; q < keys.length; q++){
            // console.log(keys[q])
            rect = svgHypothesisView.append('rect')
                             .attr('width',  499)
                             .attr('height', 150)
                             .attr('x',70)
                             .attr('y', initY)
                             .attr('id', "cohort_" + keys[q])
                             .attr('class', "cohorts cohort_" + keys[q])
                             .attr('cohort', keys[q])
                             .style("fill", "white")
                             .on("click", function(d, i) {
                                  cohort = $(this).attr("cohort")
                                  $(".cohorts").css("stroke", "none")
                                  $(".cohorts").css("fill", "white")
                                  $("#cohort_" +  cohort).css("stroke", "black")
                                  $("#cohort_" +  cohort).css("fill", "beige")
                                  $("#currentlySelectedCluster").text(cohort)
                              })
            var a = 0;

            var circle = svgHypothesisView.append("circle")
                                   .attr("cx",25 ) 
                                   .attr("cy", initY + 75)
                                   .attr("r", 15)
                                   .style("fill", "grey")
                                   .style("stroke", "black")
                                   .style("opacity", "0.9")
                                   // .attr('writer', )
            text = svgHypothesisView.append('text')
                    .text(listOfUsers.length)
                    .attr('x', 10 )
                    .attr('y', initY + 110 )
                    .style('font-size', "18px")
                    .attr('stroke', "#737373")

            for (var average in Object(filteredUsersSummary[keys[q]])) {
              if (!average.includes('completeness')){
                self.makeCohortSummaryViewAverages(svgHypothesisView, initY, average, filteredUsersSummary[keys[q]][average], a, filteredUsersSummary[keys[q]][average + "_completeness"], initX)
                a += 1
              }
            }
            initY += 150
          }

        },
        error: function(xhr) {
        }
      });
    }
  },
  makeDemoView: function(filteredUsers, cohort){
    var self = this;
    $("#hypothesisView").empty()
    var body = d3.select("#hypothesisView");
    var svgDemoView = body.append('svg').attr('height',30000).attr('width', 1000).style("float", "left");

    var cohort = cohort
    var cohortNum = 0
    if (filteredUsers != null){
      cohort = filteredUsers.toString()
    } else {
      cohortNum = parseInt(cohort.replace("C", ''))
    }
    $.ajax({
        url: "/getCohortDemoData",
        type: "get",
        data: {"listOfUsers": cohort},
        success: function(response) {
          console.log(response)
          filteredUsersSummary =  $.parseJSON(response)
          // console.log(filteredUsersSummary)
          var singleLables = Object.keys(filteredUsersSummary['distributionsSingleLabels'])
          initX = 170
          initY = 150

          clusterFill = self.gettsneClusterColor(cohortNum)
          var circle = svgDemoView.append("circle")
                                             .attr("cx",25 ) 
                                             .attr("cy", 25)
                                             .attr("r", 15)
                                             .style("fill", clusterFill)
                                             .style("stroke", "black")
          sortedLabels = []
          for (u = 0; u < singleLables.length; u++){
            fill =  "#d8b365"
            if (!lifestyle.includes(singleLables[u] )){
              fill = "#d8b365"
              sortedLabels.push({'label': singleLables[u], 'value': filteredUsersSummary['distributionsSingleLabels'][singleLables[u]], 'fill': fill })
            }
            
          }
          var multipleLables = Object.keys(filteredUsersSummary['distributionsMultipleLabels'])
          for (u = 0; u < multipleLables.length; u++){
            var multipleSublables = Object.keys(filteredUsersSummary['distributionsMultipleLabels'][multipleLables[u]]  )
            for (k = 0; k < multipleSublables.length; k++){
              fill =  "#d8b365"
              if (!lifestyle.includes(multipleSublables[k] )){
                fill = "#d8b365"
                sortedLabels.push({'label': multipleSublables[k], 'value': filteredUsersSummary['distributionsMultipleLabels'][multipleLables[u]][multipleSublables[k]], 'fill': fill })
              }
              
            }
          }
          function mycomparator(a,b) {
            return parseFloat(b.value, 10) - parseFloat(a.value, 10);
          }
          sortedLabels =  sortedLabels.sort(mycomparator);
          for (u = 0; u < sortedLabels.length; u++){
            text = svgDemoView.append('text')
              .text(sortedLabels[u]['label'] )
              .attr("text-anchor", "end")
              .attr('x', initX )
              .attr('y', initY + 15)
              .style('font-size', "14px")
              .attr('stroke', sortedLabels[u]['fill'])
              .attr('class', "")
            rect = svgDemoView.append('rect')
                      .attr('width',  85)
                      .attr('height', 25)
                      .attr('x',initX  + 10)
                      .attr('y', initY  )
                      .style("fill", "#d9d9d9")
            rect = svgDemoView.append('rect')
                      .attr('width',  85 * sortedLabels[u]['value'] )
                      .attr('height', 13)
                      .attr('x',initX  + 10)
                      .attr('y', initY + 6 )
                      .style("fill", "#737373")
            initY += 30
          }







          initX = 500
          initY = 150
          sortedLabels = []
          for (u = 0; u < singleLables.length; u++){
            fill =  "#d8b365"
            if (lifestyle.includes(singleLables[u] )){
              fill = "#5ab4ac"
              sortedLabels.push({'label': singleLables[u], 'value': filteredUsersSummary['distributionsSingleLabels'][singleLables[u]], 'fill': fill })
            }
            
          }
          var multipleLables = Object.keys(filteredUsersSummary['distributionsMultipleLabels'])
          for (u = 0; u < multipleLables.length; u++){
            var multipleSublables = Object.keys(filteredUsersSummary['distributionsMultipleLabels'][multipleLables[u]]  )
            for (k = 0; k < multipleSublables.length; k++){
              fill =  "#d8b365"
              if (lifestyle.includes(multipleSublables[k] )){
                fill = "#5ab4ac"
                sortedLabels.push({'label': multipleSublables[k], 'value': filteredUsersSummary['distributionsMultipleLabels'][multipleLables[u]][multipleSublables[k]], 'fill': fill })
              }
              
            }
          }
          function mycomparator(a,b) {
            return parseFloat(b.value, 10) - parseFloat(a.value, 10);
          }
          sortedLabels =  sortedLabels.sort(mycomparator);
          for (u = 0; u < sortedLabels.length; u++){
            text = svgDemoView.append('text')
              .text(sortedLabels[u]['label'] )
              .attr("text-anchor", "end")
              .attr('x', initX )
              .attr('y', initY + 15)
              .style('font-size', "14px")
              .attr('stroke', sortedLabels[u]['fill'])
              .attr('class', "")
            rect = svgDemoView.append('rect')
                      .attr('width',  85)
                      .attr('height', 25)
                      .attr('x',initX  + 10)
                      .attr('y', initY  )
                      .style("fill", "#d9d9d9")
            rect = svgDemoView.append('rect')
                      .attr('width',  85 * sortedLabels[u]['value'] )
                      .attr('height', 13)
                      .attr('x',initX  + 10)
                      .attr('y', initY + 6 )
                      .style("fill", "#737373")
            initY += 30
          }








          self.makeSimilarityLines(filteredUsersSummary['similarityData'], svgDemoView)
        },
        error: function(xhr) {
        }
      });
  },
  makeSimilarityLines: function(similarityData, svg ) {
    var self = this;
    // console.log(similarityData)
    var selectedCSM = $("#currentlySelectedCSM").text()
    var similarities = Object.keys(similarityData)
    initX = 65
    initY = 30

    function mycomparator(a,b) {
      return parseFloat(b.value, 10) - parseFloat(a.value, 10);
    }
    selectedCSMList =  similarityData[selectedCSM].sort(mycomparator);
    // console.log(selectedCSMList)

    for (i = 0; i < similarities.length; i++){
      rect = svg.append('rect')
                .attr('width',  540)
                .attr('height', 30)
                .attr('x',initX )
                .attr('y', initY - 20  )
                .style("fill", "white")
                .attr("similarity", similarities[i])
                .on("click", function(d, i) {
                      $(".similarityLines").remove()
                      similarity = $(this).attr("similarity")
                      $("#currentlySelectedCSM").text(similarity)
                      // console.log("ooopsss" , similarityData)
                      // console.log(svg)
                      self.makeSimilarityLines(similarityData, svg)
                  })

      text = svg.append('text')
              .text(similarities[i])
              .attr('x', initX )
              .attr('y', initY)
              .style('font-size', "18px")
              .attr('stroke', "#737373")
              .attr('class', "")
      for (j = 0; j< selectedCSMList.length; j++ ){
        rect = svg.append('rect')
                .attr('width',  520 / (selectedCSMList.length) )
                .attr('height', 30)
                .attr('x',initX + 20 )
                .attr('y', initY - 20  )
                .style("fill", "none")
                .attr("id", similarities[i] + "_" +  selectedCSMList[j]['writer'])
                .attr("writer", selectedCSMList[j]['writer'])
                .attr("class", "similarityLines")
        initX += 520 / (selectedCSMList.length)
      }

      initY += 40
      initX = 65
    }
    for (i = 0; i < similarities.length; i++){
      for (j = 0; j< similarityData[similarities[i]].length; j++ ){
        fill = self.getSimilarityColor(similarityData[similarities[i]] [j] ['value'] )
        $("#" + similarities[i] + "_"  + similarityData[similarities[i]] [j] ['writer']  ).css("fill", fill )
      }
    }


    var brushSimilaritySvg =  d3.select("#hypothesisView").select("svg")
    var brush = d3.brush()
    .extent([[85, 10], [700, 500]])
    .on("brush", brushed)
    .on("end", brushended);
    function isBrushed(brush_coords, cx, cy) {
      var x0 = brush_coords[0][0],
           x1 = brush_coords[1][0],
           y0 = brush_coords[0][1],
           y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }
    function brushed() {  
       var e = brush.extent();
    }
    function brushended(){
      var selection = d3.event.selection;
      allRects = brushSimilaritySvg.selectAll('rect');
      var brush_coords = d3.brushSelection(this);
      filtered =  allRects.filter(function (){
           var cx = d3.select(this).attr("x"),
               cy = d3.select(this).attr("y");
           return isBrushed(brush_coords, cx, cy);
      }) 
      console.log(filtered)
      self.makeUserHypothesisView(filtered, 20)


      var filteredUsers = []
      for (n = 0; n < filtered['_groups'][0].length; n++){
        if (filtered['_groups'][0][n]['attributes']['writer']){
          filteredUsers.push(filtered['_groups'][0][n]['attributes']['writer'].value)


        }
      }

      $(".allCircles").css('opacity', "0.2").css('stroke-width', "1")
      for (i = 0; i < filteredUsers.length; i++){
        
        $(".circle_" + filteredUsers[i]).css('opacity', "1").css('stroke-width', "2")
      }  
      console.log(filteredUsers)
      $("#currentlySelectedUsers").text(filteredUsers.toString())
      $("#currentlySelectedUsersNumber").text(filteredUsers.toString().split(",").length)
      $.ajax({
          url: "/getDaysInCohort",
          type: "get",
          data: { "users": filteredUsers.toString()},
          success: function(response) {
            $("#currentlySelectedNumOfDays").text(response)
          },
          error: function(xhr) {
          }
      });
      self.makeDemoView(filteredUsers, null)
    }
    brushSimilaritySvg.call(brush)


  },

  makeMachineLearningView: function(users, algo, wellness ){
    var self = this;
    $.ajax({
        url: "/getMachineLearningData",
        type: "get",
        data: {"listOfUsers": users, "algo": algo, "wellness": wellness},
        success: function(response) {
          mlData =  $.parseJSON(response)
          $("#mlTable").append("<tr " + 
            " class='" + mlData["measure"].replace("Label", '') +"_" + mlData['algo'] + "_" + 
            $("#currentlySelectedUsersNumber").text() + "_" + $("#currentlySelectedNumOfDays").text() +"' ><td>" + mlData["measure"].replace("Label", '') + ", " + mlData['algo'] + 
            " </td><td>" + 
            $("#currentlySelectedUsersNumber").text() + "</td><td>" + $("#currentlySelectedNumOfDays").text() + 
            "</td><td>" + mlData['bal_acc'] + "</td><td>" + mlData['f1'] + "</td><td>" + mlData['auc_roc'] + 
            "</td><td>" + mlData["precision"] + "</td><td>" + mlData['recall'] + "</td><td> <img users='" + users + "' mlData='" + JSON.stringify(mlData) + "' class='save_" + mlData["measure"].replace("Label", '') +"_" + mlData['algo'] + "_" + 
            $("#currentlySelectedUsersNumber").text() + "_" + $("#currentlySelectedNumOfDays").text() +"' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAdVBMVEX///8AAAA7Ozs6Ojo+Pj5vb2/7+/svLy/x8fGqqqru7u6xsbFYWFjc3NxHR0fl5eXExMRnZ2d+fn4aGhqFhYVgYGBNTU0gICDJycnh4eGXl5cmJiaJiYkTExM1NTW3t7fR0dEVFRWPj4+fn59ra2t3d3dKSko+57kJAAAFAElEQVR4nO3d63aiMBSGYawHtIrWUmo9oFar93+JI+3MqiSbg2En2TDf+7ddkGdFEZFDENwVTS7zz17LS7fJ6SOgWuxS34PjKz2PVN/41feguJvkgQff47FQcg/c+R6Nlfa/r9Qv32Ox1L7bM5i1/AF++B6HxQ7fwg59SOhlwInvQVgt+8zY+h6E1W4bm7XvMVhu0fEXabat6dzemtIumPkeguWGwcD3ECz3HvTpP4RPg8fSlhMO+v3+Piv8aXtrtVrFcfyZ3uIYfukAfuqTwiTSvl1Vd1IWQn8L/W101zjf832LrPU6iqK1+o6a5pd4fCcsT5RwSg+pInXn78VoKaWp3xAW6j9s6glfzVb/Yl+4rBIS201KODZbvQjhsY4wNly9CGFQR/hluHoZQm0TTQiHhquXIXzqvFDbgYHwgSBkCMIAQgjLg5AhCAMIISwPQoYgDCCEsDwIGYIwgBDC8iBkCMIAQgjLg5AhCAMIISwPQoYgDCCEsDwIGYIwgJBXeGiEIVPPH/UsXDbCkMWyhL1jA0u9NfgW9jaLn3OcG7F+088d9S7UStPPOF6tttttGIb7fT87W34+v16v73+bZSVJslx+DYeXy+X19W23O502m/N5uNeXJ0/InWOhh8sYn90K9beJ9Ygz0m0Kx25Ud6XEKGwK9ZPIbTdzLXR+FRy112RVuHDj+o0ahFWh68v6z+6FIzeyvw3IMdgVuv1IJD4M7Qtd3kCE2J9xIXR23fSenkEHwuBj7gJ4Kly/feFt7832JjXclHwfcyG8tX6ZTix1+Ci/PNKR0GMQQig/CCGUH4QQyg9CCOUHIYTygxBC+UEIofwghFB+EEIoPwghlB+EEMoPQgPhdDgP3TffFVzswC70cNrsv0LylBpuoddHR6xcCKmboLuLOjmRWfjsRlLUnhgSs9D3U4aIc6OYhVM3kMLsX40Aoe0gzIIQQr9BmMUqTBdj20V+hS6+WeYeJAMhhNVBaCEIIYRQCUILQQghhEoQWghCL8KRce0QThr8epMm2iN3xQlH2hof7E26MGkI7PUmsoWRunCDZAvVJ1mbFIkWvjEI86ckSBMSz8l+uKNoYfffh93flv4Hn4e3fRrijo61m8nfp8ky3y8ldkxFClmDEEIIlSC0EIQQQqgEoYUghBBCJQgtJFB43F3nps3O2t2C5Qmb3qhdvYBLnLD5IWHlSI00IcON6EPZwnNzYW/NLqSei2Eq5PjdIv9kLBZhXJvo5Len/BuRRdhL6xIrhRwXt+UPmvIIa89i9bY0bAxUDuszCevOYrWw8TWY6pNWuIQ1Z7HGJ/542AioXQjLJqxHrLVfOoqMW+tL4xPWIrZjz7twW1CD2A7hovA3zM/Kh961Q1iy+7+qmsW2CIuJVS/U1ghLZrH8hdoeoekstkhoOIttEpoRWyU0IgoUPhULi4nbQqJA4apEaDCLAoXa4O+Fj8+iPKF+V6ec8OFZlCdUn02uCh+dReVReRcrpnw5ofZhTRzbU4QPEpX/pu5qxF1uS5I/ID6KZj09VVhyFH6gpX3xivX/YU7ZVObu4UYPWxO6fyKs5a7666BjxCXxUu8WUT3J+DuOY/Fiou+v2KVZLHgia3dmkX5qcJdmseAmoN2ZRfL+mJ0ivpQIO0Gs+C7QfqK+x9YxYr/yoH2w8z3GRlH7a52axWkdYHtnMabuMUzHcTaF29JtsjneCf4AW76peTPwaCYAAAAASUVORK5CYII=' width='20' height='20' >" +  
            " <img class='" + mlData["measure"].replace("Label", '') +"_" + mlData['algo'] + "_" + $("#currentlySelectedUsersNumber").text() + "_" + $("#currentlySelectedNumOfDays").text() + "' src='data:image/png;base64,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' width='20', height = '20'>" +
            "</td> </tr>" )
           $("." + mlData["measure"].replace("Label", '') +"_" + mlData['algo'] + "_" + 
            $("#currentlySelectedUsersNumber").text() + "_" + $("#currentlySelectedNumOfDays").text()).on('click', function() {
              $( "." + $(this).attr("class")).remove()
           });


           $(".save_" + mlData["measure"].replace("Label", '') +"_" + mlData['algo'] + "_" + 
            $("#currentlySelectedUsersNumber").text() + "_" + $("#currentlySelectedNumOfDays").text()).on('click', function() {
              currentUsers = $(this).attr("users")
              currentMlData = $.parseJSON($(this).attr("mlData"))
              $("#savedModels").append("<tr id='saved_" + currentMlData["measure"].replace("Label", '') + "_" + currentMlData['algo'] + "_" + 
                $("#currentlySelectedUsersNumber").text() + "_" + $("#currentlySelectedNumOfDays").text() + "' users='"+ $(this).attr("users") + "' ><td>" + currentMlData["measure"].replace("Label", '') 
                + ", " + currentMlData['algo'] + 
                " </td><td>" + 
                $("#currentlySelectedUsersNumber").text() + "</td><td>" + $("#currentlySelectedNumOfDays").text() + 
                "</td><td>" + currentMlData['bal_acc'] + "</td><td>" + currentMlData['f1'] + "</td><td>" + currentMlData['auc_roc'] + 
                "</td><td>" + currentMlData["precision"] + "</td><td>" + currentMlData['recall'] + "</td></tr>" )
              $("#saved_" + currentMlData["measure"].replace("Label", '') + "_" + currentMlData['algo'] + "_" + $("#currentlySelectedUsersNumber").text() + "_" + $("#currentlySelectedNumOfDays").text()).on('mouseover', function() {
                  $(".allCircles").css('opacity', "0.2").css('stroke-width', "1")
                  for (i = 0; i < $(this).attr("users").split(",").length; i++){
                    
                    $(".circle_" + $(this).attr("users").split(",")[i]).css('opacity', "1").css('stroke-width', "2")
                  }  
               }).on('mouseout', function() {
                  for (i = 0; i < $(this).attr("users").split(",").length; i++){
                    $(".allCircles").css('opacity', "0.5").css('stroke-width', "1")
                  }  
               });
               
               $.ajax({
                  url: "/saveMlData",
                  type: "get",
                  data: { "listOfUsers": currentUsers,
                          "mlData": $(this).attr("mlData"),
                          "name":  mlData["measure"].replace("Label", '') +"_" + mlData['algo'] + "_" + $("#currentlySelectedUsersNumber").text() + "_" + $("#currentlySelectedNumOfDays").text()},
                  success: function(response) {
                    console.log("saved!!")
                  },
                  error: function(xhr) {
                  }
                });

           });
        },
        error: function(xhr) {
        }
    });

  },
  makeSavedModelsView: function(){
    $.ajax({
        url: "/loadSavedModels",
        type: "get",
        data: { },
        success: function(response) {
          // console.log(response)
          models =  $.parseJSON(response)
          console.log(models)
          for (i = 0; i < models.length; i++){
            currentMlData = $.parseJSON(models[i]['mlData']);
            users = models[i]['users']
            $("#savedModels").append("<tr id='saved_" + currentMlData["measure"].replace("Label", '') + "_" + currentMlData['algo'] + "_" + 
              users.split(",").length + "_" + currentMlData["numOfDays"] + "' users='"+ users + "' ><td>" + currentMlData["measure"].replace("Label", '') 
              + ", " + currentMlData['algo'] + 
              " </td><td>" + 
              users.split(",").length + "</td><td>" + currentMlData["numOfDays"] + 
              "</td><td>" + currentMlData['bal_acc'] + "</td><td>" + currentMlData['f1'] + "</td><td>" + currentMlData['auc_roc'] + 
              "</td><td>" + currentMlData["precision"] + "</td><td>" + currentMlData['recall'] + "</td></tr>" )
            $("#saved_" + currentMlData["measure"].replace("Label", '') + "_" + currentMlData['algo'] + "_" + users.split(",").length 
              + "_" + currentMlData["numOfDays"]).on('mouseover', function() {

                tempusers = $(this).attr("users")
                $(".allCircles").css('opacity', "0.2").css('stroke-width', "1")
                for (i = 0; i < tempusers.split(",").length; i++){
                  $(".circle_" + tempusers.split(",")[i]).css('opacity', "1").css('stroke-width', "2")
                  
                }  
             }).on('mouseout', function() {
                tempusers = $(this).attr("users")
                for (i = 0; i < tempusers.split(",").length; i++){
                  $(".allCircles").css('opacity', "0.5").css('stroke-width', "1")
                }  
             });
          }
        },
        error: function(xhr) {
        }
    });
  },
  makeUsersinClustersText: function(users ){
    var self = this;
    $.ajax({
        url: "/getUsersInCohort",
        type: "get",
        data: { "cluster": users},
        success: function(response) {
          // console.log(response)
          // users =  $.parseJSON(response)
          // console.log(response.split(','))
          $("#currentlySelectedUsers").text(response)
          $("#currentlySelectedUsersNumber").text(response.split(",").length)
          $.ajax({
              url: "/getDaysInCohort",
              type: "get",
              data: { "users": response},
              success: function(response) {
                $("#currentlySelectedNumOfDays").text(response)
                
              },
              error: function(xhr) {
              }
          });
        },
        error: function(xhr) {
        }
    });

  },

  gettsneClusterColor: function(channel) {
    var self = this;
    color = '#7fc97f'
    if (channel === 0){
      color = '#7fc97f'
    } else if (channel === 1){
      color = '#beaed4'
    } else if (channel === 2){
      color = '#fdc086'
    } else if (channel === 3){
      color = '#ffff99'
    } else if (channel === 4){
      color = '#bf5b17'
    } else if (channel === 5){
      color = '#f0027f'
    } else if (channel === 6){
      color = '#666666'
    } 
    return color;
  },


  getSimilarityColor: function(channel) {
    var self = this;
    color = '#f7fbff'
    if (channel <= 0.2){
      color = '#f7fbff'
    } else if (channel > 0.2 && channel <= 0.3){
      color = '#deebf7'
    } else if (channel > 0.3 && channel <= 0.4){
      color = '#c6dbef'
    } else if (channel > 0.4 && channel <= 0.5){
      color = '#9ecae1'
    } else if (channel > 0.5 && channel <= 0.6){
      color = '#6baed6'
    } else if (channel > 0.6 && channel <= 0.7){
      color = '#4292c6'
    } else if (channel > 0.7 && channel <= 0.8){
      color = '#2171b5'
    } else if (channel > 0.8 && channel <= 0.9){
      color = '#08519c'
    } else if (channel > 0.9 && channel <= 1){
      color = '#08306b'
    } 
    return color;
  }
}