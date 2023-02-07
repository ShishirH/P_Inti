//$(document).ready(function () {
//        CefSharp.DeleteBoundObject("jsHandler");
//        CefSharp.RemoveObjectFromCache("jsHandler");
//        CefSharp.BindObjectAsync("jsHandler");
//});

var iVoLVER = {
    version: "1.1",
    LOG: false,
    draggableIcons: {},
    modeTypes: {ink: 1, gesture: 2},
    standardModes: {panning: 3, disconnecting: 4, selecting: 5},
    _operatorsIcons: {
        addition: 'M 523.90641,161.28524 523.90641,292.71298 392.47868,292.71298 392.47868,401.28524 523.90641,401.28524 523.90641,532.71298 632.47868,532.71298 632.47868,401.28524 763.90641,401.28524 763.90641,292.71298 632.47868,292.71298 632.47868,161.28524 523.90641,161.28524 Z',
        subtraction: 'M 174.28572,263.79077 545.71428,263.79077 545.71428,372.3622 174.28572,372.3622 Z',
        multiplication: 'M 408.48691,254.06567 501.42036,346.99911 408.48692,439.93255 485.2591,516.70473 578.19254,423.77129 671.12599,516.70474 747.89818,439.93255 654.96473,346.99911 747.89817,254.06567 671.12599,177.29349 578.19255,270.22693 485.2591,177.29348 408.48691,254.06567 Z',
        division: 'M -372.95556,163.91549 -372.95556,271.34323 -264.3833,271.34323 -264.3833,163.91549 Z M -504.3833,309.39987 -504.3833,417.97018 -132.95361,417.97018 -132.95361,309.39987 Z M -372.95556,456.02682 -372.95556,563.45455 -264.3833,563.45455 -264.3833,456.02682 Z',
        concatenation: 'M -105.21113,-105.14201 -8.467614,-99.332349 Q -15.287653,-35.931249 -55.450102,-2.0836501 -95.359958,31.763949 -153.70918,31.763949 -223.93032,31.763949 -267.12389,-14.713351 -310.31747,-61.190652 -310.31747,-143.03112 -310.31747,-224.1138 -269.39724,-273.87482 -228.47701,-323.63584 -155.22474,-323.63584 -86.771761,-323.63584 -50.145628,-285.74674 -13.2669,-247.85764 -8.467614,-185.21432 L -107.23188,-179.90984 Q -107.23188,-214.51522 -120.61936,-229.92346 -133.75425,-245.3317 -151.68843,-245.3317 -201.70204,-245.3317 -201.70204,-144.79927 -201.70204,-88.470806 -188.81975,-68.263284 -175.68486,-48.055762 -152.19361,-48.055762 -110.26301,-48.055762 -105.21113,-105.14201 Z',
        union: 'M 91.418554,1161.701 Q 91.418554,1235.4465 46.530027,1274.7239 1.6414994,1314.0014 -85.730813,1314.0014 -173.10313,1314.0014 -217.99165,1274.7239 -262.61299,1235.4465 -262.61299,1161.9682 L -262.61299,907.86709 -159.47625,907.86709 -159.47625,1156.09 Q -159.47625,1197.505 -142.10867,1217.8117 -124.74108,1238.1184 -85.730813,1238.1184 -47.254932,1238.1184 -29.620154,1218.6133 -11.718181,1199.1081 -11.718181,1156.09 L -11.718181,907.86709 91.418554,907.86709 91.418554,1161.701 Z',
        intersection: 'M -440.72797,-1794.9235 Q -440.72797,-1868.6689 -485.61647,-1907.9464 -530.50507,-1947.2238 -617.87737,-1947.2238 -705.24967,-1947.2238 -750.13817,-1907.9464 -794.75957,-1868.6689 -794.75957,-1795.1907 L -794.75957,-1541.0895 -691.62277,-1541.0895 -691.62277,-1789.3124 Q -691.62277,-1830.7276 -674.25517,-1851.0341 -656.88767,-1871.3408 -617.87737,-1871.3408 -579.40147,-1871.3408 -561.76667,-1851.8357 -543.86467,-1832.3308 -543.86467,-1789.3124 L -543.86467,-1541.0895 -440.72797,-1541.0895 -440.72797,-1794.9235 Z',
        difference: 'M -423.58505,702.84033 -423.58505,277.65246 -259.11677,277.65246 Q -151.9632,277.65246 -98.697902,341.19702 -45.432608,404.74158 -45.432608,488.22169 -45.432608,583.53853 -102.74731,643.34518 -159.75052,702.84033 -251.01795,702.84033 L -423.58505,702.84033 Z M -293.0695,605.03155 -259.11677,605.03155 Q -226.7215,605.03155 -204.60551,573.57076 -182.17801,542.10997 -182.17801,487.9102 -182.17801,441.49775 -202.11356,407.85651 -221.73762,374.21527 -259.11677,374.21527 L -293.0695,374.21527 -293.0695,605.03155 Z', // D        
//        difference: 'M0,45.4L67.8,0l198.9,296.7l-67.8,45.4L0,45.4z', // \
    },
    _valuesBackgrounds: {
        circularValue: "M -19607.823,-44092.402 -19615.565,-44079.185 -19623.472,-44066.066 -19631.544,-44053.048 -19639.779,-44040.132 -19648.175,-44027.321 -19656.732,-44014.616 -19665.447,-44002.02 -19674.32,-43989.534 -19683.35,-43977.161 -19692.534,-43964.902 -19701.871,-43952.759 -19711.361,-43940.735 -19721,-43928.831 -19730.789,-43917.049 -19740.724,-43905.391 -19750.806,-43893.859 -19761.031,-43882.455 -19771.399,-43871.179 -19781.908,-43860.035 -19792.557,-43849.024 -19803.342,-43838.148 -19814.264,-43827.408 -19825.319,-43816.806 -19836.507,-43806.344 -19847.826,-43796.023 -19859.273,-43785.845 -19870.847,-43775.812 -19882.547,-43765.925 -19894.37,-43756.186 -19906.314,-43746.597 -19918.378,-43737.158 -19930.559,-43727.871 -19942.856,-43718.739 -19955.267,-43709.761 -19967.79,-43700.94 -19980.423,-43692.278 -19993.163,-43683.774 -20006.01,-43675.432 -20018.96,-43667.251 -20032.012,-43659.234 -20045.164,-43651.382 -20058.413,-43643.695 -20071.758,-43636.176 -20085.196,-43628.825 -20098.726,-43621.643 -20112.344,-43614.632 -20126.05,-43607.793 -20139.841,-43601.126 -20153.714,-43594.633 -20167.668,-43588.315 -20181.7,-43582.173 -20195.808,-43576.208 -20209.99,-43570.42 -20224.244,-43564.811 -20238.567,-43559.382 -20252.957,-43554.133 -20267.412,-43549.065 -20281.93,-43544.179 -20296.507,-43539.476 -20311.143,-43534.957 -20325.834,-43530.622 -20340.579,-43526.472 -20355.375,-43522.508 -20370.219,-43518.729 -20385.109,-43515.138 -20400.044,-43511.734 -20415.02,-43508.518 -20430.035,-43505.49 -20445.087,-43502.652 -20460.174,-43500.002 -20475.293,-43497.543 -20490.441,-43495.273 -20505.617,-43493.194 -20520.818,-43491.307 -20536.041,-43489.61 -20551.285,-43488.104 -20566.546,-43486.791 -20581.822,-43485.669 -20597.111,-43484.739 -20612.411,-43484.001 -20627.719,-43483.456 -20643.033,-43483.103 -20658.349,-43482.943 -20673.667,-43482.975 -20688.983,-43483.2 -20704.294,-43483.617 -20719.6,-43484.226 -20734.896,-43485.028 -20750.182,-43486.021 -20765.453,-43487.207 -20780.709,-43488.585 -20795.946,-43490.154 -20811.162,-43491.915 -20826.354,-43493.866 -20841.521,-43496.009 -20856.66,-43498.341 -20871.769,-43500.864 -20886.844,-43503.577 -20901.884,-43506.478 -20916.887,-43509.569 -20931.849,-43512.848 -20946.769,-43516.314 -20961.645,-43519.968 -20976.473,-43523.808 -20991.252,-43527.835 -21005.979,-43532.047 -21020.652,-43536.443 -21035.269,-43541.024 -21049.827,-43545.788 -21064.323,-43550.734 -21078.757,-43555.862 -21093.125,-43561.171 -21107.425,-43566.661 -21121.655,-43572.329 -21135.813,-43578.176 -21149.896,-43584.201 -21163.902,-43590.402 -21177.83,-43596.778 -21191.676,-43603.329 -21205.438,-43610.053 -21219.115,-43616.95 -21232.704,-43624.018 -21246.204,-43631.256 -21259.611,-43638.664 -21272.925,-43646.239 -21286.141,-43653.981 -21299.26,-43661.888 -21312.278,-43669.96 -21325.194,-43678.195 -21338.006,-43686.591 -21350.71,-43695.148 -21363.307,-43703.863 -21375.792,-43712.736 -21388.166,-43721.766 -21400.424,-43730.95 -21412.567,-43740.287 -21424.591,-43749.777 -21436.495,-43759.416 -21448.277,-43769.205 -21459.935,-43779.14 -21471.467,-43789.222 -21482.872,-43799.447 -21494.147,-43809.816 -21505.291,-43820.324 -21516.302,-43830.973 -21527.178,-43841.758 -21537.918,-43852.68 -21548.52,-43863.735 -21558.982,-43874.923 -21569.303,-43886.242 -21579.481,-43897.689 -21589.514,-43909.263 -21599.401,-43920.963 -21609.14,-43932.786 -21618.729,-43944.73 -21628.168,-43956.794 -21637.455,-43968.975 -21646.588,-43981.272 -21655.565,-43993.683 -21664.386,-44006.206 -21673.048,-44018.839 -21681.552,-44031.579 -21689.894,-44044.426 -21698.075,-44057.376 -21706.092,-44070.428 -21713.944,-44083.58 -21721.631,-44096.829 -21729.15,-44110.174 -21736.501,-44123.612 -21743.683,-44137.142 -21750.694,-44150.76 -21757.534,-44164.466 -21764.2,-44178.257 -21770.693,-44192.13 -21777.011,-44206.084 -21783.153,-44220.116 -21789.119,-44234.224 -21794.906,-44248.406 -21800.515,-44262.66 -21805.945,-44276.983 -21811.193,-44291.373 -21816.261,-44305.828 -21821.147,-44320.346 -21825.85,-44334.923 -21830.369,-44349.559 -21834.704,-44364.25 -21838.854,-44378.995 -21842.819,-44393.791 -21846.597,-44408.635 -21850.188,-44423.525 -21853.592,-44438.46 -21856.808,-44453.436 -21859.836,-44468.451 -21862.675,-44483.504 -21865.324,-44498.59 -21867.783,-44513.709 -21870.053,-44528.857 -21872.132,-44544.033 -21874.02,-44559.234 -21875.716,-44574.457 -21877.222,-44589.701 -21878.536,-44604.962 -21879.657,-44620.238 -21880.587,-44635.527 -21881.325,-44650.827 -21881.87,-44666.135 -21882.223,-44681.449 -21882.383,-44696.765 -21882.351,-44712.083 -21882.127,-44727.399 -21881.71,-44742.71 -21881.1,-44758.016 -21880.299,-44773.312 -21879.305,-44788.598 -21878.119,-44803.869 -21876.741,-44819.125 -21875.172,-44834.362 -21873.412,-44849.578 -21871.46,-44864.77 -21869.318,-44879.937 -21866.985,-44895.076 -21864.462,-44910.185 -21861.749,-44925.26 -21858.848,-44940.3 -21855.757,-44955.303 -21852.478,-44970.265 -21849.012,-44985.185 -21845.358,-45000.061 -21841.518,-45014.889 -21837.491,-45029.668 -21833.28,-45044.395 -21828.883,-45059.068 -21824.302,-45073.685 -21819.539,-45088.243 -21814.592,-45102.739 -21809.464,-45117.173 -21804.155,-45131.541 -21798.665,-45145.841 -21792.997,-45160.071 -21787.15,-45174.229 -21781.125,-45188.312 -21774.925,-45202.318 -21768.548,-45216.246 -21761.997,-45230.092 -21755.273,-45243.854 -21748.376,-45257.531 -21741.308,-45271.121 -21734.07,-45284.62 -21726.662,-45298.027 -21719.087,-45311.341 -21711.345,-45324.558 -21703.438,-45337.676 -21695.366,-45350.694 -21687.131,-45363.61 -21678.735,-45376.422 -21670.179,-45389.126 -21661.463,-45401.723 -21652.59,-45414.208 -21643.56,-45426.582 -21634.376,-45438.84 -21625.039,-45450.983 -21615.55,-45463.007 -21605.91,-45474.911 -21596.121,-45486.693 -21586.186,-45498.351 -21576.104,-45509.883 -21565.879,-45521.288 -21555.511,-45532.563 -21545.002,-45543.707 -21534.354,-45554.718 -21523.568,-45565.594 -21512.646,-45576.334 -21501.591,-45586.936 -21490.403,-45597.398 -21479.084,-45607.719 -21467.637,-45617.897 -21456.063,-45627.93 -21444.363,-45637.817 -21432.54,-45647.556 -21420.596,-45657.145 -21408.532,-45666.584 -21396.351,-45675.871 -21384.054,-45685.004 -21371.643,-45693.981 -21359.12,-45702.802 -21346.487,-45711.464 -21333.747,-45719.968 -21320.9,-45728.31 -21307.95,-45736.491 -21294.898,-45744.508 -21281.747,-45752.36 -21268.497,-45760.047 -21255.152,-45767.566 -21241.714,-45774.917 -21228.185,-45782.099 -21214.566,-45789.11 -21200.86,-45795.95 -21187.069,-45802.616 -21173.196,-45809.109 -21159.242,-45815.427 -21145.21,-45821.569 -21131.102,-45827.535 -21116.92,-45833.322 -21102.666,-45838.931 -21088.343,-45844.361 -21073.953,-45849.609 -21059.498,-45854.677 -21044.981,-45859.563 -21030.403,-45864.266 -21015.767,-45868.785 -21001.076,-45873.12 -20986.331,-45877.27 -20971.536,-45881.235 -20956.691,-45885.013 -20941.801,-45888.604 -20926.866,-45892.008 -20911.89,-45895.224 -20896.875,-45898.252 -20881.823,-45901.091 -20866.736,-45903.74 -20851.617,-45906.2 -20836.469,-45908.469 -20821.293,-45910.548 -20806.092,-45912.436 -20790.869,-45914.132 -20775.625,-45915.638 -20760.364,-45916.952 -20745.088,-45918.073 -20729.799,-45919.003 -20714.499,-45919.741 -20699.191,-45920.286 -20683.878,-45920.639 -20668.561,-45920.799 -20653.243,-45920.767 -20637.928,-45920.543 -20622.616,-45920.126 -20607.31,-45919.516 -20592.014,-45918.715 -20576.728,-45917.721 -20561.457,-45916.535 -20546.201,-45915.157 -20530.964,-45913.588 -20515.748,-45911.828 -20500.556,-45909.876 -20485.389,-45907.734 -20470.25,-45905.401 -20455.142,-45902.878 -20440.066,-45900.165 -20425.026,-45897.264 -20410.023,-45894.173 -20395.061,-45890.894 -20380.141,-45887.428 -20365.265,-45883.774 -20350.437,-45879.934 -20335.658,-45875.907 -20320.931,-45871.696 -20306.258,-45867.299 -20291.642,-45862.718 -20277.084,-45857.955 -20262.587,-45853.008 -20248.153,-45847.88 -20233.785,-45842.571 -20219.485,-45837.081 -20205.255,-45831.413 -20191.097,-45825.566 -20177.014,-45819.542 -20163.008,-45813.341 -20149.081,-45806.964 -20135.235,-45800.413 -20121.472,-45793.689 -20107.795,-45786.792 -20094.206,-45779.724 -20080.706,-45772.486 -20067.299,-45765.078 -20053.986,-45757.503 -20040.769,-45749.761 -20027.65,-45741.854 -20014.632,-45733.782 -20001.716,-45725.547 -19988.905,-45717.151 -19976.2,-45708.595 -19963.604,-45699.879 -19951.118,-45691.006 -19938.745,-45681.976 -19926.486,-45672.792 -19914.343,-45663.455 -19902.319,-45653.966 -19890.415,-45644.326 -19878.633,-45634.538 -19866.975,-45624.602 -19855.443,-45614.52 -19844.039,-45604.295 -19832.763,-45593.927 -19821.619,-45583.418 -19810.608,-45572.77 -19799.732,-45561.984 -19788.992,-45551.062 -19778.39,-45540.007 -19767.928,-45528.819 -19757.607,-45517.5 -19747.429,-45506.053 -19737.396,-45494.479 -19727.509,-45482.779 -19717.77,-45470.956 -19708.181,-45459.012 -19698.742,-45446.948 -19689.455,-45434.767 -19680.323,-45422.47 -19671.345,-45410.059 -19662.524,-45397.536 -19653.862,-45384.903 -19645.358,-45372.163 -19637.016,-45359.316 -19628.835,-45346.366 -19620.818,-45333.314 -19612.966,-45320.163 -19605.279,-45306.913 -19597.76,-45293.569 -19590.409,-45280.13 -19583.227,-45266.601 -19576.216,-45252.982 -19569.377,-45239.276 -19562.71,-45225.485 -19556.217,-45211.612 -19549.899,-45197.658 -19543.757,-45183.626 -19537.792,-45169.518 -19532.004,-45155.336 -19526.395,-45141.082 -19520.966,-45126.759 -19515.717,-45112.369 -19510.649,-45097.914 -19505.763,-45083.397 -19501.06,-45068.819 -19496.541,-45054.183 -19492.206,-45039.492 -19488.056,-45024.747 -19484.092,-45009.952 -19480.313,-44995.107 -19476.722,-44980.217 -19473.318,-44965.282 -19470.102,-44950.306 -19467.074,-44935.291 -19464.236,-44920.239 -19461.586,-44905.152 -19459.127,-44890.033 -19456.857,-44874.885 -19454.778,-44859.709 -19452.891,-44844.508 -19451.194,-44829.285 -19449.688,-44814.042 -19448.375,-44798.78 -19447.253,-44783.504 -19446.323,-44768.215 -19445.585,-44752.915 -19445.04,-44737.607 -19444.687,-44722.294 -19444.527,-44706.977 -19444.559,-44691.659 -19444.784,-44676.344 -19445.201,-44661.032 -19445.81,-44645.726 -19446.612,-44630.43 -19447.605,-44615.144 -19448.791,-44599.873 -19450.169,-44584.617 -19451.738,-44569.381 -19453.499,-44554.164 -19455.45,-44538.972 -19457.593,-44523.805 -19459.925,-44508.666 -19462.448,-44493.558 -19465.161,-44478.482 -19468.062,-44463.442 -19471.153,-44448.439 -19474.432,-44433.477 -19477.898,-44418.557 -19481.552,-44403.681 -19485.392,-44388.853 -19489.419,-44374.074 -19493.631,-44359.347 -19498.027,-44344.674 -19502.608,-44330.058 -19507.372,-44315.5 -19512.318,-44301.003 -19517.446,-44286.569 -19522.755,-44272.201 -19528.245,-44257.901 -19533.913,-44243.671 -19539.76,-44229.513 -19545.785,-44215.43 -19551.986,-44201.424 -19558.362,-44187.497 -19564.913,-44173.651 -19571.637,-44159.888 -19578.534,-44146.211 -19585.602,-44132.622 -19592.84,-44119.122 -19600.248,-44105.715 Z",
        squareValue: "M 0.5859375 0.5859375 L 0.5859375 499.41406 L 499.41406 499.41406 L 499.41406 0.5859375 L 0.5859375 0.5859375 z",
        collection: "M -21258.697,-45498.051 C -21618.963,-45498.051 -21908.996,-45208.018 -21908.996,-44847.752 -21908.996,-44370.875 -21908.996,-43893.972 -21908.996,-43417.095 L -21258.697,-43417.095 -20634.411,-43417.095 -19984.112,-43417.095 C -19984.112,-43893.972 -19984.112,-44370.875 -19984.112,-44847.752 -19984.112,-45208.018 -20274.145,-45498.051 -20634.411,-45498.051 Z"
    },
    getOperationsForType: function (type) {
        return iVoLVER._dataTypes[type].operations;
    },
    typeHasOperation: function (type, operation) {
        var tmp = iVoLVER._dataTypes[type].operations[operation];
        return (!iVoLVER.util.isUndefined(tmp) && !iVoLVER.util.isNull(tmp));
    },
    getSupportedTypesForOperation: function (type, operation) {
        return iVoLVER._dataTypes[type].operations[operation];
    },
    operationSupportedForType: function (type, operation, otherType) {
        return iVoLVER.util.isUndefined(iVoLVER._dataTypes[type].operations[operation][otherType]);
    },
    setOperationForType: function (type, operation, otherType, theMethod) {
        iVoLVER._dataTypes[type].operations[operation][otherType] = theMethod;
    },
    _modeButtons: [
        'panningModeButton',
        'disconnectingModeButton',
        'floodFillButton',
        'multipleColorRegionsButton',
        'groupColorRegionButton',
        'lineTextExtractorButton',
        'blockTextExtractorButton',
        'samplerButton',
        'samplerLineButton',
        'drawPathMark',
        'drawFilledMark',
        'drawFunction',
        'squaredSelectionButton'
    ],
    data: {
        associateOperationsForType: function (requiredOperation, commutative, operationName, arity) {

            if (iVoLVER.util.isString(requiredOperation)) {
                if (!(binary && !commutative)) {

                    if (iVoLVER.LOG) {
//                    // console.log("%c ++++ " + operatorName + " ++++++ " + requiredOperation + " +++++++++++++ ", "background: blue; color: white;");
                    }

                    Object.keys(iVoLVER._dataTypes).forEach(function (registeredType) {

                        if (iVoLVER.LOG) {
//                        // console.log("%c                        " + registeredType + "                           ", "background: purple; color: white;");
                        }

                        var typeHasOperation = iVoLVER.typeHasOperation(registeredType, requiredOperation);

                        if (typeHasOperation) {

                            var supportedTypes = iVoLVER.getSupportedTypesForOperation(registeredType, requiredOperation);

                            if (iVoLVER.LOG) {
//                            // console.log("iVoLVER.getSupportedTypesForOperation(" + registeredType + ", " + requiredOperation + ")");
//                            // console.log("supportedTypes:");
//                            // console.log(supportedTypes);
                            }

                            Object.keys(supportedTypes).forEach(function (supportedType) {

                                if (supportedType !== registeredType) {

                                    // the association has to be done ONLY if it has not be done before
                                    // if the requiredOperation has not been defined with the registered type, we do it
                                    // (e.g., addition has been defined between DateAndTime and Duration values, but not between Duration and DateAndTime ones)


                                    // console.log(operationName + " Commutative: " + commutative);

                                    if (commutative) {
                                        if (!iVoLVER.typeHasOperation(supportedType, requiredOperation) || iVoLVER.operationSupportedForType(supportedType, requiredOperation, registeredType)) {
                                            // we establish the commutative nature for this datatype here here
                                            if (iVoLVER.LOG) {
                                                // console.log("%c Associating " + supportedType + " and " + registeredType + "!!!", "background: green; color: white;");
                                                // console.log("%cIMPORTANT:" + requiredOperation + " should be defined between %c" + supportedType + " %cand %c" + registeredType, "background: pink; color: black;", "background: pink; color: black; font-weight:bold;", "background: pink; color: black; font-weight:normal;", "background: pink; color: black; font-weight:bold;");
                                            }
                                            if (!iVoLVER.typeHasOperation(supportedType, requiredOperation)) {
                                                iVoLVER._dataTypes[supportedType].operations[requiredOperation] = {};
                                            }

                                            iVoLVER.setOperationForType(supportedType, requiredOperation, registeredType, function (aValue) {
                                                // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& aValue:");
                                                // console.log(aValue);
                                                // console.log("this:");
                                                // console.log(this);
                                                return aValue[operation](this);
                                            });

                                        }
                                    }





                                }
                            });
                        }
                    });
                }
            }

        },
        canOperateWith: function (type1, type2, operation) {
            var operations = iVoLVER.data.getAvailableOperations(type1);
            var operationObject = operations[operation];
            if (iVoLVER.util.isObject(operationObject)) {
                return !iVoLVER.util.isUndefined(operationObject[type2]);
            } else {
                return type1 === type2;
            }
        },
        getAvailableOperations: function (type) {
            return iVoLVER._dataTypes[type].operations;
        },
        registerOperator: function (parameters) {



            //        if (iVoLVER.LOG) {
            // console.log("%cRegistering new Operator:" + parameters.name + "...", "background: blue; color: white;");
//        }

            var operatorName = removeSpaces(parameters.name);

            if (!iVoLVER.util.isUndefined(iVoLVER._operators[operatorName])) {
                throw "There exists an operator called " + parameters.name + ".";
            }

            var iconPath = parameters.iconPath;
            var iconClass = parameters.iconClass || "fa fa-question";
            var nSamples = parameters.nSamples;
            var finalWidth = parameters.finalWidth || 60;
            var outputsCollectiveVal = parameters.outputsCollectiveVal;
            var onlyCollectiveInputs = parameters.onlyCollectiveInputs;
            var binary = parameters.binary;
            var commutative = iVoLVER.util.isUndefined(parameters.commutative) || iVoLVER.util.isNull(parameters.commutative) ? true : parameters.commutative;
            var requiredOperation = parameters.requiredOperation;
            var operationName = parameters.name;
            var computeResult = parameters.computeResult;
            var customResultComputation = false;
            var maxInputs = parameters.maxInputs;

            if (iVoLVER.util.isUndefined(requiredOperation) || iVoLVER.util.isNull(requiredOperation)) {
                if (iVoLVER.util.isUndefined(computeResult) || iVoLVER.util.isNull(computeResult)) {
                    throw ("iVoLVER EXCEPTION: Error while registering the " + operatorName + " operator. No computeResult function was sent in the registration parameters. A computeResult function has to be specified when registering an operator that does not require any operation at the value level.");
                } else {
                    customResultComputation = true;
                }
            } else if (iVoLVER.util.isArray(requiredOperation) && requiredOperation.length > 1) {
                if (iVoLVER.util.isUndefined(computeResult) || iVoLVER.util.isNull(computeResult)) {
                    throw ("iVoLVER EXCEPTION: Error while registering the " + operatorName + " operator. No computeResult function was sent in the registration parameters. A computeResult function has to be specified when registering an operator that requires more than one operation.");
                } else {
                    customResultComputation = true;
                }
            } else if (!iVoLVER.util.isUndefined(parameters.acceptCollectiveVals)) {

                if (parameters.acceptCollectiveVals !== false) {
                    if (iVoLVER.util.isUndefined(computeResult) || iVoLVER.util.isNull(computeResult)) {
                        throw ("iVoLVER EXCEPTION: Error while registering the " + operatorName + " operator. No computeResult function was sent in the registration parameters. A computeResult function has to be specified when registering an operator that might accept collective values.");
                    } else {
                        customResultComputation = true;
                    }
                }
            }

            iVoLVER.gui.add.draggableIcon({
                sectionID: iVoLVER.gui.getSectionByTitle(iVoLVER.gui.sectionTitles.operators),
                name: operatorName,
                iconClass: iconClass,
                elementID: operatorName + 'Operator',
                tooltip: parameters.tooltip || parameters.name,
                data: [{key: 'type', value: 'operator'}, {key: 'operatorName', value: operatorName}],
                outputsCollectiveVal: outputsCollectiveVal
            });

            var functionName = "create" + operatorName + "Operator";
            iVoLVER._operators[operatorName] = {
                constructor: functionName
            };

            // this is not done anymore here
//            iVoLVER.data.associateOperationsForType(requiredOperation, commutative, operationName, binary);

            window[functionName] = function () {

                var options = arguments[0];
                var backgroundShape = outputsCollectiveVal ? iVoLVER._valuesBackgrounds.collection : iVoLVER._valuesBackgrounds.circularValue;
                var backgroundPolygons = getPolygonsFromPathWithHoles(backgroundShape, 100, true);
                var iconPolygons = getPolygonsFromPathWithHoles(iconPath, nSamples || 200, false);
                var svgPath = getVisualValueSVG(iconPolygons, finalWidth, backgroundPolygons);

                var newOperator = new iVoLVER.Operator({
                    top: options.top,
                    left: options.left,
                    path: svgPath,
                    strokeWidth: 2.5,
                    preventInteractiveEditing: true,
                    compressed: true,
                    compressing: true,
                    animateBirth: true,
                    value: null,
                    binary: binary,
                    commutative: commutative,
                    requiredOperation: requiredOperation,
                    destinationCompulsory: false,
                    isOperator: true,
                    customResultComputation: customResultComputation,
                    name: operationName,
                    maxInputs: maxInputs
                });

                // these functions cannot be sent initialization options becuause fabric.js will invoke all the functions
                // during the initialization without sending the right parameters to the acceptSingleVals & acceptCollectiveVals methods
                newOperator.acceptSingleVals = iVoLVER.util.isUndefined(parameters.acceptSingleVals) ? true : parameters.acceptSingleVals;
                newOperator.acceptCollectiveVals = iVoLVER.util.isUndefined(parameters.acceptCollectiveVals) ? false : parameters.acceptCollectiveVals;
                newOperator.computeResult = computeResult;

                if (iVoLVER.util.isUndefined(onlyCollectiveInputs) || iVoLVER.util.isNull(onlyCollectiveInputs)) {
                    if (onlyCollectiveInputs) {
                        newOperator.acceptSingleVals = false;
                        newOperator.acceptCollectiveVals = true;
                    }
                }

                newOperator.checkForAcceptableValues = function (incommingValue) {
                    var theOperator = this;
                    // Independent code to checks whether a value is acceptable for this operator depending whether it is
                    // a single value or a collection
                    var shouldAcceptCollections = false;
                    var shouldAcceptSingleValues = false;
                    var incommingKind = null;
                    if ($.isArray(incommingValue)) {
                        var acceptCollectiveVals = theOperator.acceptCollectiveVals;
                        if (!iVoLVER.util.isUndefined(acceptCollectiveVals) && !iVoLVER.util.isNull(acceptCollectiveVals)) {
                            incommingKind = 'collective';
                            if (iVoLVER.util.isFunction(acceptCollectiveVals)) {
                                shouldAcceptCollections = acceptCollectiveVals(theOperator); // a function was defined by the programmer to evaluate when the operator should accept collections as inputs
                            } else {
                                shouldAcceptCollections = acceptCollectiveVals; // the programmer just indicated a boolean variable to indicate whether collections should be accepted or not by this operator
                            }
                        }
                    } else {
                        var acceptSingleVals = theOperator.acceptSingleVals;
                        if (!iVoLVER.util.isUndefined(acceptSingleVals) && !iVoLVER.util.isNull(acceptSingleVals)) {
                            incommingKind = 'single';
                            if (iVoLVER.util.isFunction(acceptSingleVals)) {
                                shouldAcceptSingleValues = acceptSingleVals(theOperator); // a function was defined by the programmer to evaluate when the operator should accept scalars as inputs
                            } else {
                                shouldAcceptSingleValues = acceptSingleVals; // the programmer just indicated a boolean variable to indicate whether scalars should be accepted or not by this operator
                            }
                        }
                    }
                    return {
                        incommingKind: incommingKind,
                        shouldAcceptSingleValues: shouldAcceptSingleValues,
                        shouldAcceptCollections: shouldAcceptCollections
                    }
                };


                newOperator.getRequiredAndMissingOperations = function (value) {
                    var theOperator = this;
                    var requiredOperation = theOperator.requiredOperation;
                    var operationsRequired = new Array();
                    var operationsMissing = new Array();

                    var availableOperations = iVoLVER.data.getAvailableOperations(value);

                    // console.log("%c**** availableOperations:", "background: gray; color: black;");
                    // console.log(availableOperations);

                    if (iVoLVER.util.isString(requiredOperation)) {
                        // a single operation is required and no data type is specified
                        operationsRequired.push(requiredOperation);
                        if (iVoLVER.util.isUndefined(availableOperations[requiredOperation])) {
                            operationsMissing.push('<b>' + requiredOperation + '</b>');
                        }
                    } else if (iVoLVER.util.isArray(requiredOperation)) {
                        requiredOperation.forEach(function (operationDescription) {
                            if (iVoLVER.util.isString(operationDescription)) {
                                operationsRequired.push(requiredOperation);
                                if (iVoLVER.util.isUndefined(availableOperations[requiredOperation])) {
                                    operationsMissing.push('<b>' + requiredOperation + '</b>');
                                }
                            } else if (iVoLVER.util.isObject(operationDescription)) {
                                var methodName = operationDescription.operation + (operationDescription.on || '');
                                operationsRequired.push(methodName);
                                if (iVoLVER.util.isUndefined(availableOperations[operationDescription.operation])) {
                                    if (!iVoLVER.util.isUndefined(operationDescription.on)) {
                                        operationsMissing.push('<b>' + operationDescription.operation + '</b> on <b>' + operationDescription.on + '</b> values');
                                    } else {
                                        operationsMissing.push('<b>' + operationDescription.operation + '</b>');
                                    }
                                } else {
                                    if (!iVoLVER.util.isUndefined(operationDescription.on) && iVoLVER.util.isUndefined(availableOperations[operationDescription.operation][operationDescription.on])) {
                                        operationsMissing.push('<b>' + operationDescription.operation + '</b> on <b>' + operationDescription.on + '</b> values');
                                    }
                                }
                            }
                        });
                    }
                    return {
                        operationsRequired: operationsRequired,
                        operationsMissing: operationsMissing
                    };
                };

                newOperator.processConnectionRequest = function (theConnector) {
                    var sourceObject = theConnector.source;
                    var connectionAccepted = true;
                    var message = null;
                    var processedValue = null;
                    var theOperator = this;

                    // OPERATORs can NOT be located. So, connections from locators should be rejected
                    if (sourceObject.isLocator) {

                        connectionAccepted = false;
                        message = 'This element cannot be located.';

                    } else {


                        // console.log("newOperator.maxInputs:");
                        // console.log(newOperator.maxInputs);


                        if (!iVoLVER.util.isUndefined(maxInputs) && newOperator.getInConnections().length >= newOperator.maxInputs) {

                            connectionAccepted = false;
                            message = 'This operator cannot take more incoming connections. <b>' + maxInputs + '</b> is the maximun allowed.';

                        } else {



                            var incommingValue = theConnector.value;

                            if (iVoLVER.util.isUndefined(incommingValue) || iVoLVER.util.isNull(incommingValue)) {
                                connectionAccepted = false;
                                message = 'The source object <b>does not contain</b> a value';
                            } else {

                                var sampleValue = incommingValue;
                                if ($.isArray(incommingValue)) {
                                    sampleValue = incommingValue[0];
                                }
                                var incomingType = sampleValue.getDataType();

                                // Independent code to checks whether a value is acceptable for this operator depending whether it is
                                // a single value or a collection

                                var obj = newOperator.checkForAcceptableValues(incommingValue);
                                var incommingKind = obj.incommingKind;
                                var acceptableValue = obj.shouldAcceptSingleValues || obj.shouldAcceptCollections;

                                // independent code to determine the lists of required and missing operations
                                // this only considers the information contained by the operator
                                var requiredOperation = theOperator.requiredOperation;
                                var operationIsRequired = !iVoLVER.util.isUndefined(requiredOperation) && !iVoLVER.util.isNull(requiredOperation);

                                var operatorIsEmpty = theOperator.inConnections.length < 1; // nothing has been fed to the operator yet


                                var currentResult = theOperator.value;

                                var operationSupportComplete = false;
                                if (!iVoLVER.util.isUndefined(currentResult) && !iVoLVER.util.isNull(currentResult)) { // something is in the operator
                                    var currentType = currentResult.getDataType();
                                    /*// console.log("currentType: " + currentType);
                                     // console.log("incomingType: " + incomingType);
                                     // console.log("requiredOperation: " + requiredOperation);
                                     var a = currentResult.implements(requiredOperation, incomingType);
                                     var b = sampleValue.implements(requiredOperation, currentType);
                                     // console.log("a: " + a);
                                     // console.log("b: " + b);*/
                                    operationSupportComplete = currentResult.implementsOn(requiredOperation, incomingType);
                                    if (theOperator.commutative) {
                                        operationSupportComplete = operationSupportComplete || sampleValue.implementsOn(requiredOperation, currentType);
                                    }
                                } else { // there is no value in the operator
                                    operationSupportComplete = sampleValue.implements(requiredOperation);
                                    if (theOperator.commutative) {
                                        // console.log("This operator is commutative...");
                                        operationSupportComplete = operationSupportComplete || sampleValue.couldBeOperandOf(requiredOperation);
                                    }
                                }
                                // console.log("operationSupportComplete:");
                                // console.log(operationSupportComplete);
                                if (operatorIsEmpty) {
                                    if (operationSupportComplete || !operationIsRequired) {
                                        if (theOperator.binary && !theOperator.commutative) {
                                            // when an operator has two operands and it represents a non commutative operation,
                                            // it cannot accept incoming connections. The connections should be done directly to the operands.
                                            connectionAccepted = false;
                                            if (theOperator.isCompressed) {
                                                message = 'Which <b>operand</b> are you trying to set?';
                                                theOperator.expand();
                                            } else {
                                                message = 'Connect the <b>operand</b> you are trying to set.';
                                            }
                                        } else {
                                            // for commutative operators that can handle any number of inputs
                                            if (!acceptableValue) {
                                                if (iVoLVER.util.isNull(incommingKind)) {
                                                    connectionAccepted = false;
                                                    message = 'This operator does not accept values.';
                                                } else {
                                                    connectionAccepted = false;
                                                    message = 'This operator does not accept <b>' + incommingKind + '</b> values.';
                                                }
                                            }
                                        }
                                    } else {
                                        connectionAccepted = false;
                                        message = '<b>' + operationName + '</b> is not possible for values of type <b>' + sampleValue.getDataType() + '</b>.';
                                    }
                                } else { // the operator currently holds a value
                                    if (operationSupportComplete || !operationIsRequired) {
                                        if (theOperator.binary && !theOperator.commutative) {
                                            connectionAccepted = false;
                                            if (theOperator.isCompressed) {
                                                message = 'Which <b>operand</b> are you trying to set?';
                                                theOperator.expand();
                                            } else {
                                                message = 'Connect the <b>operand</b> you are trying to set.';
                                            }
                                        } else {
                                            // for commutative operators that can handle any number of inputs
                                            if (acceptableValue) {
                                                // values have been fed to the operator already. Hence, the operator holds a resulting value
                                                // we need to check the compatibility of that resulting value with the new input
                                                if (operationSupportComplete) {
                                                    if (!acceptableValue) {
                                                        if (iVoLVER.util.isNull(incommingKind)) {
                                                            connectionAccepted = false;
                                                            message = 'This operator does not accept values.';
                                                        } else {
                                                            connectionAccepted = false;
                                                            message = 'This operator does not accept <b>' + incommingKind + '</b> values.';
                                                        }
                                                    }
                                                } else {
                                                    connectionAccepted = false;
                                                    message = 'This operator holds a <b>' + currentResult.getDataType() + '</b> value. The <b>' + operationRequiredNow + '</b> operation is not defined between this type and a <b>' + sampleValue.getDataType() + '</b> value.';
                                                }
                                            } else {
                                                if (iVoLVER.util.isNull(incommingKind)) {
                                                    connectionAccepted = false;
                                                    message = 'This operator does not accept values.';
                                                } else {
                                                    connectionAccepted = false;
                                                    message = 'This operator does not accept <b>' + incommingKind + '</b> values.';
                                                }
                                            }
                                        }
                                    } else {
                                        connectionAccepted = false;
                                        message = 'The <b>' + operationName + '</b> operation is not possible between <b>' + currentType + '</b> and <b>' + incomingType + '</b> values.';

                                    }
                                }
                            }


                        }




                    }
                    return {
                        connectionAccepted: connectionAccepted,
                        message: message,
                        processedValue: processedValue
                    };
                };

                /*newOperator.processConnectionRequest = function (theConnector) {
                 var sourceObject = theConnector.source;
                 var connectionAccepted = true;
                 var message = null;
                 var processedValue = null;
                 var theOperator = this;

                 // OPERATORs can NOT be located. So, connections from locators should be rejected
                 if (sourceObject.isLocator) {

                 connectionAccepted = false;
                 message = 'This element cannot be located.';

                 } else {

                 var incommingValue = theConnector.value;

                 if (iVoLVER.util.isUndefined(incommingValue) || iVoLVER.util.isNull(incommingValue)) {
                 connectionAccepted = false;
                 message = 'The source object <b>does not contain</b> a value';
                 } else {

                 var sampleValue = incommingValue;
                 if ($.isArray(incommingValue)) {
                 sampleValue = incommingValue[0];
                 }
                 var incomingType = sampleValue.getDataType();

                 //                            // Independent code to checks whether a value is acceptable for this operator depending whether it is
                 //                            // a single value or a collection

                 var acceptableValue = newOperator.checkForAcceptableValues(incommingValue);

                 // independent code to determine the lists of required and missing operations
                 // this only considers the information contained by the operator
                 var requiredOperation = theOperator.requiredOperation;
                 var operationIsRequired = !iVoLVER.util.isUndefined(requiredOperation) && !iVoLVER.util.isNull(requiredOperation);

                 // we check whether the given input implements or not the operation(s) that the operator requires
                 var obj = theOperator.getRequiredAndMissingOperations(incomingType);
                 var operationsRequired = obj.operationsRequired;
                 var operationsMissing = obj.operationsMissing;







                 var inputValueLmplementsRequiredOperation = operationsMissing.length === 0;
                 var operatorIsEmpty = theOperator.inConnections.length < 1; // nothing has been fed to the operator yet

                 var currentResult = theOperator.value;

                 if (!operatorIsEmpty && currentResult) {
                 // the incoming value should get then the support it requires for the operation of this operator from the current result
                 sampleValue.addOperationSupportForType(currentResult.getDataType());
                 // we change this in case the support was indeed found
                 inputValueLmplementsRequiredOperation = sampleValue.supports[requiredOperation][currentResult.getDataType()];


                 var pepe = sampleValue.getSupportedOperations();
                 // console.log("pepe -***********************");
                 // console.log(pepe);

                 }

                 if (iVoLVER.LOG) {
                 // console.log("%c                                                   ", "background: blue; color: white;");
                 // console.log("%coperationsRequired:", "background: blue; color: white;");
                 // console.log(operationsRequired);
                 // console.log("%coperationsMissing:", "background: blue; color: white;");
                 // console.log(operationsMissing);
                 // console.log("%coperatorIsEmpty: " + operatorIsEmpty, "background: blue; color: white;");
                 // console.log("%cimplementsRequiredOperation: " + inputValueLmplementsRequiredOperation, "background: blue; color: white;");
                 // console.log("%coperationIsRequired: " + operationIsRequired, "background: blue; color: white;");
                 // console.log("%ctheOperator.binary: " + (theOperator.binary), "background: blue; color: white;");
                 // console.log("%ctheOperator.commutative: " + theOperator.commutative, "background: blue; color: white;");
                 // console.log("%cacceptableValue: " + acceptableValue, "background: blue; color: white;");
                 }




                 var operationImplementedByIncomingValue = false;

                 var implementedOperations = sampleValue.getImplementedOperations();
                 //                            if () {

                 //                            }

                 var operationSupportedByOtherTypes = false;






                 if (operatorIsEmpty) {




                 if (inputValueLmplementsRequiredOperation || !operationIsRequired) {
                 if (theOperator.binary && !theOperator.commutative) {

                 // when an operator has two operands and it represents a non commutative operation,
                 // it cannot accept incoming connections. The connections should be done directly to the operands.

                 connectionAccepted = false;
                 if (theOperator.isCompressed) {
                 message = 'Which <b>operand</b> are you trying to set?';
                 theOperator.expand();
                 } else {
                 message = 'Connect the <b>operand</b> you are trying to set.';
                 }
                 } else {
                 // for commutative operators that can handle any number of inputs
                 if (!acceptableValue) {
                 if (iVoLVER.util.isNull(incommingKind)) {
                 connectionAccepted = false;
                 message = 'This operator does not accept values.';
                 } else {
                 connectionAccepted = false;
                 message = 'This operator does not accept <b>' + incommingKind + '</b> values.';
                 }
                 }
                 }

                 } else {
                 connectionAccepted = false;

                 // console.log("+++++++++++++++operationsMissing");
                 // console.log(operationsMissing);

                 message = iVoLVER._buildMissingOperationsErrorMessage(operationName, sampleValue.getDataType(), operationsMissing);
                 }

                 } else { // the operator currently holds a value

                 if (theOperator.commutative) {

                 if (inputValueLmplementsRequiredOperation || !operationIsRequired) {

                 if (theOperator.binary && !theOperator.commutative) {

                 connectionAccepted = false;
                 if (theOperator.isCompressed) {
                 message = 'Which <b>operand</b> are you trying to set?';
                 theOperator.expand();
                 } else {
                 message = 'Connect the <b>operand</b> you are trying to set.';
                 }
                 } else {
                 // for commutative operators that can handle any number of inputs
                 if (acceptableValue) {

                 // values have been fed to the operator already. Hence, the operator holds a resulting value
                 // we need to check the compatibility of that resulting value with the new input



                 if (!iVoLVER.util.isUndefined(currentResult) && !iVoLVER.util.isNull(currentResult)) { // the result held by the operator is valid

                 // console.log("%c           RESULT  VALID  IN  THE  OPERATOR                                        ", "background: red; color: white;");
                 // console.log(operationsRequired.length);
                 // console.log(!theOperator.customResultComputation);

                 if (operationsRequired.length === 1 && !theOperator.customResultComputation) {

                 var operationRequiredNow = operationsRequired[0];


                 // console.log("%coperationRequiredNow: " + operationRequiredNow, "background: blue; color: white;");

                 //                                            var methodRequiredNow = operationRequiredNow + '' + sampleValue.getDataType();
                 //                                            var operationIsPossible = !iVoLVER.util.isUndefined(currentResult[methodRequiredNow]) && !iVoLVER.util.isNull(currentResult[methodRequiredNow]);

                 var operationCode = iVoLVER._dataTypes[currentResult.getDataType()].operations[operationRequiredNow][sampleValue.getDataType()];
                 var operationIsPossible = !iVoLVER.util.isUndefined(operationCode) && !iVoLVER.util.isNull(operationCode);

                 if (operationIsPossible) {
                 if (!acceptableValue) {
                 if (iVoLVER.util.isNull(incommingKind)) {
                 connectionAccepted = false;
                 message = 'This operator does not accept values.';
                 } else {
                 connectionAccepted = false;
                 message = 'This operator does not accept <b>' + incommingKind + '</b> values.';
                 }
                 }
                 } else {
                 connectionAccepted = false;
                 message = 'This operator holds a <b>' + currentResult.getDataType() + '</b> value. The <b>' + operationRequiredNow + '</b> operation is not defined between this type and a <b>' + sampleValue.getDataType() + '</b> value.';
                 }

                 }


                 // Is that value acceptable in the sense that is a collection?
                 // can that value


                 }








                 } else {

                 if (iVoLVER.util.isNull(incommingKind)) {
                 connectionAccepted = false;
                 message = 'This operator does not accept values.';
                 } else {
                 connectionAccepted = false;
                 message = 'This operator does not accept <b>' + incommingKind + '</b> values.';
                 }


                 }
                 }

                 } else {






                 connectionAccepted = false;
                 message = iVoLVER._buildMissingOperationsErrorMessage(operationName, sampleValue.getDataType(), operationsMissing);

                 }

                 } else {

                 // no support is required in the new input, as long as the current result can deal with it

                 var currentResult = theOperator.value;
                 var type1 = currentResult.getDataType();

                 if (iVoLVER.data.canOperateWith(type1, incomingType, theOperator.requiredOperation)) {

                 connectionAccepted = true;

                 } else {

                 connectionAccepted = false;
                 message = type1 + " Values cannot be " + theOperator.requiredOperation + "ed to " + incomingType + " values";

                 }

                 }




                 }
                 }
                 }
                 return {
                 connectionAccepted: connectionAccepted,
                 message: message,
                 processedValue: processedValue
                 };
                 };*/



                if (!newOperator.customResultComputation) {

                    newOperator.computeResult = function (newValue) {

                        // console.log("%ccomputing result of the " + newOperator.name + " using default function:", "background: red; color; white;");
                        // console.log(newValue);

                        var theOperator = this;
                        var result = null;
                        var currentValue = theOperator.value;
                        var requiredOperation = theOperator.requiredOperation;

//                        // console.log("--------- theOperator.commutative: +++++++++++++");
//                        // console.log(theOperator.commutative);

                        // is this an non-communitative operator with two operands?
                        if (theOperator.binary && !theOperator.commutative) {
                            var firstValue = theOperator.firstOperand.value;
                            if (!iVoLVER.util.isUndefined(firstValue) && !iVoLVER.util.isNull(firstValue)) {
                                var secondValue = theOperator.secondOperand.value;
                                if (!iVoLVER.util.isUndefined(secondValue) && !iVoLVER.util.isNull(secondValue)) {
                                    result = firstValue[requiredOperation](secondValue);
                                }
                            }
                        } else {

                            if (iVoLVER.util.isUndefined(currentValue) || iVoLVER.util.isNull(currentValue)) {

                                // console.log("newValue:");
                                // console.log(newValue);



                                var methodName = requiredOperation + '' + newValue.getDataType();

                                if (newValue[methodName]) {

                                    // console.log("----++++++++++++++----------- methodName:");
                                    // console.log(methodName);

                                    // we try to perform the operation between the given value and [null | undefined]
                                    // this will enable unary operators to work properly
                                    result = newValue[methodName](currentValue);
                                }
                                // if that operation did not produce a meaningful result, the operator will just hold the given value
                                if (iVoLVER.util.isUndefined(result) || iVoLVER.util.isNull(result)) {
                                    result = newValue;
                                }

                            } else {


                                // console.log("RESULT Value found in the operator!");

                                result = theOperator.inConnections[0].value; // originally, the result is the first value associated to the incoming connections

                                // console.log("%cnewValue:", "background: yellow; color: blue;");
                                // console.log("result.getDataType():");
                                // console.log(result.getDataType());

                                for (var i = 1; i < theOperator.inConnections.length; i++) {

                                    var inConnection = theOperator.inConnections[i];
                                    var connectionValue = inConnection.value;

                                    if (!iVoLVER.util.isUndefined(connectionValue) && !iVoLVER.util.isNull(connectionValue)) {
                                        // console.log("connectionValue:");
                                        // console.log(connectionValue);

                                        var incomingType = connectionValue.getDataType();

                                        // console.log("%c result[" + requiredOperation + "]", "background: blue; color: white;");
                                        // console.log(result[requiredOperation]);
                                        // console.log("%c connectionValue.getDataType():", "background: pink; color: blue;");
                                        // console.log(connectionValue.getDataType());
                                        // console.log("%c result.getDataType():", "background: grey; color: blue;");
                                        // console.log(result.getDataType());




                                        if (!result.implementsOn(requiredOperation, incomingType)) {

                                            // console.log("Current result of type " + result.getDataType() + " does not implement " + requiredOperation + " on " + incomingType + " values");

                                            result.addOperationSupport(requiredOperation, incomingType);

                                            if (result.supports[requiredOperation][incomingType]) {
                                                result = result[requiredOperation](connectionValue);
                                            } else {
                                                alert(":S");
                                            }
                                        } else {
                                            result = result[requiredOperation](connectionValue);
                                        }
                                    }









//                                    if (iVoLVER.util.isUndefined(result[requiredOperation])) {
//
//                                        // trying to find if the operation has been defined in the other value
//
//                                        // console.log("theOperator.commutative: ******************");
//                                        // console.log(theOperator.commutative);
//
//                                        // console.log("%c ****************************************", "background: blue; color: white;");
//
//
//                                        var inputType = connectionValue.getDataType();
//
//                                        // console.log("currentType: " + currentType);
//                                        // console.log("inputType " + inputType);
//
//                                        // console.log("but.....................................................");
//                                        // console.log("iVoLVER._dataTypes[" + currentType + "].operations[" + requiredOperation + "][" + inputType + "]");
//
//                                        if (!iVoLVER.util.isUndefined(iVoLVER._dataTypes[currentType].operations[requiredOperation][inputType])) {
//                                            result[requiredOperation] = function (aValue) {
//
//                                                // console.log("%c $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", "background: blue; color: yellow;");
//
//                                                // console.log("aValue.getDataType():");
//                                                // console.log(aValue.getDataType());
//
//                                                var operationCode = iVoLVER._dataTypes[currentType].operations[requiredOperation][inputType];
//                                                var tmpName = requiredOperation + '' + aValue.getDataType();
//                                                result[tmpName] = operationCode;
//
//                                                // console.log("tmpName:");
//                                                // console.log(tmpName);
//
//                                                return result[tmpName](aValue);
//                                            };
//                                        }
//                                    }


                                }
                            }
                        }
                        theOperator.shouldUpdateColor = true;
                        return result;
                    };
                }


                newOperator.gatherInValues = function () {
                    var theOperator = this;
                    var values = new Array();
                    theOperator.inConnections.forEach(function (inConnection) {
                        values.push(inConnection.value);
                    });
                    return values;
                };


                newOperator.inValueUpdated = function (value, withAnimation) {
                    var theOperator = this;
                    var result = null;
                    if (theOperator.customResultComputation) {


                        var values = theOperator.gatherInValues();

                        // console.log("%cGathered incoming values:", "background: red, color: white;");
                        // console.log(values);

                        var oldResult = theOperator.value;
                        try {
                            result = theOperator.computeResult(values);
                        } catch (err) {
                            result = oldResult;
                            showErrorMessage(err, 1000);
                        }


                    } else {

                        result = theOperator.computeResult();

                    }
                    theOperator.setValue(result, withAnimation);
                };

                newOperator.acceptConnection = function (theConnector) {

                    var theOperator = this;

                    var currentValue = theOperator.value;

                    theOperator._previousValues.push(currentValue);

                    var result = null;
                    if (theOperator.customResultComputation) {
                        var values = theOperator.gatherInValues();
                        var oldResult = theOperator.value;
                        try {
                            result = theOperator.computeResult(values);
                        } catch (err) {
                            result = oldResult;
                            theConnector.contract();
                            showErrorMessage(err, 1000);
                        }

                    } else {



                        result = theOperator.computeResult(theConnector.value);
                    }

                    // console.log("result:");
                    // console.log(result);

                    theOperator.setValue(result, true);

                };

                if (binary && !commutative) {

                    var background = new fabric.Rect({
                        originX: 'center',
                        originY: 'center',
                        rx: 10,
                        ry: 10,
                        stroke: newOperator.stroke,
                        strokeWidth: 1,
                        selectable: false
                    });
                    newOperator.background = background;

                    var firstOperand = new iVoLVER.model.ValueHolder({
                        isCollective: onlyCollectiveInputs,
                        operator: newOperator
                    });
                    newOperator.addChild(firstOperand, {
                        whenCompressed: {
                            x: 0, y: 0
                        },
                        whenExpanded: {
                            x: -12, y: 0,
                            originParent: {originX: 'left', originY: 'center'},
                            originChild: {originX: 'right', originY: 'center'}
                        },
                        movable: false
                    });






                    // first operant should check that the values it gets are able to perform this operation
                    firstOperand.processConnectionRequest = function (theConnector) {
                        var sourceObject = theConnector.source;
                        var connectionAccepted = null;
                        var message = null;
                        var processedValue = null;
                        var theOperator = firstOperand.operator;

                        var incommingValue = theConnector.value;

                        if (iVoLVER.util.isUndefined(incommingValue) || iVoLVER.util.isNull(incommingValue)) {
                            connectionAccepted = false;
                            message = 'The source object <b>does not contain</b> a value';
                        } else {

                            var shouldAcceptCollections = false;
                            var shouldAcceptSingleValues = false;
                            var incommingKind = null;

                            var sampleValue = incommingValue;
                            if ($.isArray(incommingValue)) {
                                sampleValue = incommingValue[0];
                            }

                            var requiredOperation = theOperator.requiredOperation;

                            // is the operation required by this operator defined for this value
                            var operationFunction = sampleValue[requiredOperation];
                            var implementsRequiredOperation = !iVoLVER.util.isUndefined(operationFunction) && !iVoLVER.util.isNull(operationFunction);

                            if (implementsRequiredOperation) {

                                if ($.isArray(incommingValue)) {
                                    var acceptCollectiveVals = theOperator.acceptCollectiveVals;
                                    if (!iVoLVER.util.isUndefined(acceptCollectiveVals) && !iVoLVER.util.isNull(acceptCollectiveVals)) {
                                        incommingKind = 'collective';
                                        if (iVoLVER.util.isFunction(acceptCollectiveVals)) {
                                            shouldAcceptCollections = acceptCollectiveVals(theOperator); // a function was defined by the programmer to evaluate when the operator should accept collections as inputs
                                        } else {
                                            shouldAcceptCollections = acceptCollectiveVals; // the programmer just indicated a boolean variable to indicate whether collections should be accepted or not by this operator
                                        }
                                    }
                                } else {
                                    var acceptSingleVals = theOperator.acceptSingleVals;
                                    if (!iVoLVER.util.isUndefined(acceptSingleVals) && !iVoLVER.util.isNull(acceptSingleVals)) {
                                        incommingKind = 'single';
                                        if (iVoLVER.util.isFunction(acceptSingleVals)) {
                                            shouldAcceptSingleValues = acceptSingleVals(theOperator); // a function was defined by the programmer to evaluate when the operator should accept scalars as inputs
                                        } else {
                                            shouldAcceptSingleValues = acceptSingleVals; // the programmer just indicated a boolean variable to indicate whether scalars should be accepted or not by this operator
                                        }
                                    }
                                }

                                var valueAcceptable = shouldAcceptSingleValues || shouldAcceptCollections;
                                if (valueAcceptable) {

                                    connectionAccepted = true;

                                } else {
                                    if (iVoLVER.util.isNull(incommingKind)) {
                                        connectionAccepted = false;
                                        message = 'This operator does not accept values.';
                                    } else {
                                        connectionAccepted = false;
                                        message = 'This operator does not accept <b>' + incommingKind + '</b> values.';
                                    }
                                }

                            } else {

                                connectionAccepted = false;
                                message = '<b>' + operationName + '</b> is not defined for values of type <b>' + sampleValue.getDataType() + '</b>. They don\'t implement the <b>' + theOperator.requiredOperation + '</b> operation.';


                            }





                        }

                        // logic here to accept or reject incoming connections

                        return {
                            connectionAccepted: connectionAccepted,
                            message: message,
                            processedValue: processedValue
                        };
                    };


                    newOperator.subscribe(firstOperand, 'valueSet', function (subscriber, subscribable) {
                        var result = newOperator.computeResult(subscribable.value);
                        if (!iVoLVER.util.isUndefined(result) && !iVoLVER.util.isNull(result)) {
                            subscriber.setValue(result, true);
                        }
                    });

                    var secondOperand = new iVoLVER.model.ValueHolder({
                        isCollective: onlyCollectiveInputs,
                        operator: newOperator
                    });
                    newOperator.addChild(secondOperand, {
                        whenCompressed: {
                            x: 0, y: 0
                        },
                        whenExpanded: {
                            x: 12, y: 0,
                            originParent: {originX: 'right', originY: 'center'},
                            originChild: {originX: 'left', originY: 'center'}
                        },
                        movable: false
                    });

                    newOperator.subscribe(secondOperand, 'valueSet', function (subscriber, subscribable) {
                        // console.log("second operand set");
                        var result = newOperator.computeResult(subscribable.value);
                        if (!iVoLVER.util.isUndefined(result) && !iVoLVER.util.isNull(result)) {
                            subscriber.setValue(result, true);
                        }
                    });

                    // VERTICAL BACKGROUND
                    newOperator.addChild(background, {
                        whenCompressed: {
                            deltaLeft: 0, deltaRight: 0,
                            deltaTop: -10, deltaBottom: 10,
                            scaleY: 1
                        },
                        whenExpanded: {
                            deltaLeft: -25 - firstOperand.width, deltaRight: 25 + secondOperand.width,
                            deltaTop: -10, deltaBottom: 10
                        },
                        onPositioning: function (object, newOperator) {
                            object.setGradient('fill', {
                                type: 'linear',
                                x1: 0, y1: 0, x2: 0, y2: object.getScaledHeight(),
                                colorStops: {
                                    0: 'rgb(255,255,255, 1)',
                                    0.5: 'rgba(242,242,242,0.75)',
                                    1: 'rgb(255,255,255, 1)'
                                }
                            });
                        }
                    });

                    newOperator.firstOperand = firstOperand;
                    newOperator.secondOperand = secondOperand;

                    canvas.add(background);
                    canvas.add(firstOperand);
                    canvas.add(secondOperand);
                }

                newOperator.stackElements = function () {
                    var theOperator = this;
                    if (theOperator.background) {
                        bringToFront(theOperator.background);
                    }
                    bringToFront(theOperator);
                    theOperator.inConnections.forEach(function (inConnection) {
                        bringToFront(inConnection);
                    });
                    theOperator.outConnections.forEach(function (outConnection) {
                        bringToFront(outConnection);
                    });
                    if (theOperator.firstOperand) {
                        bringToFront(theOperator.firstOperand);
                        theOperator.firstOperand.inConnections.forEach(function (inConnection) {
                            bringToFront(inConnection);
                        });
                        theOperator.firstOperand.outConnections.forEach(function (outConnection) {
                            bringToFront(outConnection);
                        });
                    }
                    if (theOperator.secondOperand) {
                        bringToFront(theOperator.secondOperand);
                        theOperator.secondOperand.inConnections.forEach(function (inConnection) {
                            bringToFront(inConnection);
                        });
                        theOperator.secondOperand.outConnections.forEach(function (outConnection) {
                            bringToFront(outConnection);
                        });
                    }
                };

                newOperator.registerListener('added', function (options) {
                    if (newOperator.binary && !newOperator.commutative) {
                        if (newOperator.background) {
                            canvas.add(newOperator.background);
                        }
                        if (newOperator.firstOperand) {
                            canvas.add(newOperator.firstOperand);
                        }
                        if (newOperator.secondOperand) {
                            canvas.add(newOperator.secondOperand);
                        }
                        newOperator.stackElements();
                        if (newOperator.animateBirth) {
                            newOperator.expand({
                                easing: fabric.util.ease.easeOutBack,
                                duration: 500
                            });
                        }
                    } else {
                        if (newOperator.animateBirth) {
                            animateBirth(newOperator, false, 1, 1, function () {
                                newOperator.positionObjects();
                            });
                        }
                    }
                });
                return newOperator;
            };
        },
        registerType: function (parameters) {

//        if (iVoLVER.LOG) {
            // console.log("%cRegistering new data type:" + parameters.name + "...", "background: plum; color: black;");
//        }

            var typeName = removeSpaces(parameters.name);
            var iconPath = parameters.iconPath;
            var fillColor = parameters.fillColor;
            var strokeColor = parameters.strokeColor;
            var nSamples = parameters.nSamples || 100;
            var finalWidth = parameters.finalWidth || 50;
            var iconClass = parameters.iconClass || "fa fa-question";
            var defaults = parameters.defaults;
            var sectionID = parameters.sectionID || iVoLVER.gui.getSectionByTitle(iVoLVER.gui.sectionTitles.values);

            if (iVoLVER.util.isNull(typeName) || iVoLVER.util.isUndefined(typeName) || iVoLVER.util.isNull(iconPath) || iVoLVER.util.isUndefined(iconPath)) {
                throw "The definition of a new data type requires, at least, a name and an icon path.";
            } else {
                if (iVoLVER._dataTypes[typeName]) {
                    throw "There exists a " + typeName + " data type already.";
                } else {

                    if (iVoLVER.util.isNull(fillColor) || iVoLVER.util.isUndefined(fillColor)) {
                        fillColor = rgb(20, 200, 20);
                    }
                    if (iVoLVER.util.isNull(strokeColor) || iVoLVER.util.isUndefined(strokeColor)) {
                        strokeColor = darken(fillColor);
                    }

                    var backgroundPolygons = getPolygonsFromPathWithHoles(iVoLVER._valuesBackgrounds.circularValue, 500, true);
                    var iconPolygons = getPolygonsFromPathWithHoles(iconPath, nSamples, false);

                    var collectiveBgPolygons = getPolygonsFromPathWithHoles(iVoLVER._valuesBackgrounds.collection, 500, true);
                    var collectiveIconPolygons = getPolygonsFromPathWithHoles(iconPath, nSamples, false);

                    var squareBgPolygons = getPolygonsFromPathWithHoles(iVoLVER._valuesBackgrounds.squareValue, 500, true);
                    var squareIconPolygons = getPolygonsFromPathWithHoles(iconPath, nSamples, false);

                    var iconBounds = ClipperLib.JS.BoundsOfPaths(iconPolygons, 1);
                    var iconWidth = Math.abs(iconBounds.right - iconBounds.left);
                    var iconHeight = Math.abs(iconBounds.bottom - iconBounds.top);
                    var longestIconSide = Math.max(iconWidth, iconHeight);
                    var scale = longestIconSide / 50;
                    ClipperLib.JS.ScaleDownPaths(iconPolygons, scale);
                    var scaledIconPath = paths2string(iconPolygons, 1);

                    iVoLVER._dataTypes[typeName] = {
                        valuePath: getVisualValueSVG(iconPolygons, finalWidth, backgroundPolygons),
                        collectivePath: getVisualValueSVG(collectiveIconPolygons, finalWidth, collectiveBgPolygons),
                        readOnlyValuePath: getVisualValueSVG(squareIconPolygons, finalWidth - 4, squareBgPolygons),
                        iconPath: scaledIconPath,
                        fill: fillColor,
                        stroke: strokeColor,
                        operations: {}
                    };

                    var operations = parameters.operations || {};
                    if (operations) {
                        for (var operationName in operations) {
                            var operation = operations[operationName];
                            if (iVoLVER.util.isUndefined(iVoLVER._dataTypes[typeName].operations[operationName]) || iVoLVER.util.isNull(iVoLVER._dataTypes[typeName].operations[operationName])) {
                                iVoLVER._dataTypes[typeName].operations[operationName] = {};
                            }
                            if (iVoLVER.util.isFunction(operation)) {
                                iVoLVER._dataTypes[typeName].operations[operationName][typeName] = operation;
                            } else if (iVoLVER.util.isObject(operation)) {
                                for (var type in operation) {
                                    iVoLVER._dataTypes[typeName].operations[operationName][type] = operation[type];
                                }
                            }
                        }
                    }

                    iVoLVER.gui.add.draggableIcon({
                        sectionID: sectionID,
                        elementID: 'is' + typeName + 'Data',
                        tooltip: typeName,
                        iconClass: iconClass,
                        data: [{key: 'type', value: 'value'}, {key: 'typeName', value: typeName}]
                    });

                    var functionName = "create" + typeName + "Value";

                    var constructor = parameters.init;

                    window[functionName] = function () {
                        var options = arguments[0];
                        if (iVoLVER.util.isUndefined(options) && !iVoLVER.util.isUndefined(defaults)) {
                            if (iVoLVER.util.isFunction(defaults)) {
                                options = defaults();
                            } else {
                                options = defaults;
                            }
                        }
                        var value = null;
                        if (iVoLVER.util.isUndefined(constructor) || iVoLVER.util.isNull(constructor)) {
                            value = new iVoLVER.model.Value(options);
                        } else {
                            value = constructor(options);
                        }
                        value.clone = function () {
                            return window[functionName](value);
                        };

                        var typeProposition = "is" + typeName + "Value";
                        value[typeProposition] = true;
                        value.getTypeProposition = function () {
                            return typeProposition;
                        };
                        value.getDataType = function () {
                            return typeName;
                        };
                        value.getValuePath = function () {
                            return iVoLVER._dataTypes[typeName].valuePath;
                        };
                        value.getReadOnlyValuePath = function () {
                            return iVoLVER._dataTypes[typeName].readOnlyValuePath;
                        };
                        value.getCollectiveValuePath = function () {
                            return iVoLVER._dataTypes[typeName].collectivePath;
                        };
                        value.getIconPath = function () {
                            return iVoLVER._dataTypes[typeName].iconPath;
                        };
                        value.getFillColor = function () {
                            return iVoLVER._dataTypes[typeName].fill;
                        };
                        value.getStrokeColor = function () {
                            return iVoLVER._dataTypes[typeName].stroke;
                        };

                        value.getDisplayableString = parameters.getDisplayableString;
                        value.equals = parameters.equals;
                        value.afterRender = parameters.afterRender;

                        value.serializable = parameters.serializable || [];
                        value.reviver = functionName;

                        value.iVoLVERType = 'Value';
                        value.type = typeName;

                        // adding the operation support this value include in its definition
                        value.addOperationSupportForType(typeName);
                        // not anymore
//                        value.addOperationSupportForRegisteredTypes();

                        var editingFunctionParameters = parameters.onEditing;

                        if (!iVoLVER.util.isUndefined(editingFunctionParameters)) {
                            value.editingParameters = editingFunctionParameters;
                            iVoLVER.registerEditingFunction(typeName, parameters.name, editingFunctionParameters);
                        }

                        return value;
                    };
                }
            }
        }
    },
    _configurationFunctions: {},
    gui: {
        toolbar: 'theMenu',
        add: {
            button: function (buttonDescription) {

                var sectionID = buttonDescription.sectionID;
                var id = buttonDescription.id || ('button_' + iVoLVER.util.generateID());
                var tooltip = buttonDescription.tooltip;
                var iconClass = buttonDescription.iconClass;

                var toolbar = $("#" + sectionID);
                toolbar.append('<li class="description verticalLeftDivider verticalRightDivider verticalRightDivider2" id="' + id + '" unselectable="on" onselectstart="return false;" draggable="false" class="mode"><a><i class="fa ' + iconClass + ' "> </i> </a></li>');
                var li = $("#" + id);
                if (tooltip) {
                    li.attr('title', tooltip);
                }
                if (buttonDescription.onDoubleClick) {
                    li.dblclick(function () {
                        buttonDescription.onDoubleClick(li);
                    });
                }
                if (buttonDescription.onClick) {
                    li.click(function () {
                        buttonDescription.onClick(li);
                    });
                }
                var data = buttonDescription.data;
                if (data) {
                    for (var attribute in data) {
                        li.data(attribute, data[attribute]);
                    }
                }
            },
            modeButton: function (modeDescription) {

                var modeName = removeSpaces(modeDescription.name);
                var sectionID = modeDescription.sectionID || 'theMenu';

                if (iVoLVER._customModes[modeName]) {
                    throw ("A mode with the name " + modeDescription.name + " has been registered already");
                } else {

                    var modeID = removeSpaces(modeName) + 'CustomMode';

                    iVoLVER.gui.add.button({
                        sectionID: sectionID,
                        id: modeID,
                        tooltip: modeDescription.tooltip,
                        iconClass: modeDescription.iconClass,
                        data: {
                            customModeName: modeName
                        },
                        onClick: modeButtonClicked
                    });

                    iVoLVER._customModes[modeName] = modeDescription;
                    iVoLVER._customModes[modeName].workspace = {};

                }
            },
            iconGroup: function (parameters) {
                var sectionID = parameters.id || ("palette_section_" + iVoLVER.util.generateID());
                var title = parameters.title;
                var noSeparator = parameters.noSeparator;
                var separatorPosition = parameters.separatorPosition || 'TOP';

                if (!iVoLVER.util.isNull(iVoLVER.gui.getSectionByTitle(title))) {
                    throw "The section titles must be unique. There exist a section tittled " + title + " already.";
                } else {
                    var rightPanel = $("#rightPanel");
                    var theList = $('<h6 id="' + sectionID + 'H6" style="cursor: pointer;" class="nonSelection sectionHeader"><span class="fa fa-angle-down" style="margin-right: 5px;"></span>' + title + '</h6>');
                    var theUl = $('<ul />', {id: sectionID, class: 'horizontalButtomsRow'});

                    if (!noSeparator && separatorPosition.toUpperCase() === 'TOP') {
                        rightPanel.append($('<hr />'));
                    }

                    rightPanel.append(theList);
                    rightPanel.append(theUl);

                    if (!noSeparator && separatorPosition.toUpperCase() === 'BOTTOM') {
                        rightPanel.append($('<hr />'));
                    }

                    theList.click(function () {
                        togglePanelVisibility(sectionID);
                    });
                    iVoLVER.gui._paletteSections[sectionID] = {title: title, elements: []};
                    return sectionID;
                }
            },
            draggableIcon: function (parameters) {

                var sectionID = parameters.sectionID;
                var elementID = parameters.elementID || ('section_element_' + iVoLVER.util.generateID());
                var iconClass = parameters.iconClass;
                var tooltip = parameters.tooltip;
                var outputsCollectiveVal = parameters.outputsCollectiveVal;
                var onMouseUp = parameters.onMouseUp;
                var liStyle = iVoLVER.util.isUndefined(parameters.liStyle) || iVoLVER.util.isNull(parameters.liStyle) ? "margin-top: 2px; margin-right: 1%; margin-left: 1%; min-width: 22%; max-width: 22%; width: 22%; margin-bottom: 2px;" : parameters.liStyle;
                var aStyle = iVoLVER.util.isUndefined(parameters.aStyle) || iVoLVER.util.isNull(parameters.aStyle) ? 'text-align: center;' : parameters.aStyle;
                var iStyle = iVoLVER.util.isUndefined(parameters.iStyle) || iVoLVER.util.isNull(parameters.iStyle) ? 'text-align: center; font-size: 25px;' : parameters.iStyle;

                liStyle += " float: left;";

                var datatypesList = $("#" + sectionID);

                datatypesList.append('<li id="' + elementID + '" draggable="true" class="description dragElement" style="' + liStyle + '"><a style="' + aStyle + '"><i class="' + iconClass + '" style="' + iStyle + '"></i></i></a></li>');

                var li = $("#" + elementID);

                if (outputsCollectiveVal) {
                    li.addClass('collection');
                    li.css('padding-bottom', '5px');
                } else {
                    li.addClass('circularBorder');
                }

                if (tooltip) {
                    li.attr("title", tooltip);
                }

                var data = parameters.data;
                if (data) {
                    data.forEach(function (entry) {
                        var key = entry.key;
                        var value = entry.value;
                        li.data(key, value);
                    });
                }

                li.draggable({
                    cursorAt: {top: 18.5, left: 60},
                    cursor: 'none',
                    scroll: false,
                    helper: function (event) {
                        if (outputsCollectiveVal) {
                            return $("<div style='z-index: 100; margin-top: -4px; margin-left: 28px;'><li><i class='" + iconClass + "' style='border:1px solid #aaa; padding-top: 10px; padding-bottom: 10px; padding-left: 10px; padding-right: 10px; -webkit-border-top-left-radius: 1.5em; -webkit-border-top-right-radius: 1.5em; -moz-border-radius-topleft: 1.5em; -moz-border-radius-topright: 1.5em; border-top-left-radius: 1.5em; border-top-right-radius: 1.5em;'></i></li></div>");
                        } else {
                            return $("<div style='z-index: 100; margin-top: -4px; margin-left: 28px;'><li><i class='" + iconClass + "' style='border:1px solid #aaa; border-radius: 10em; padding-top: 10px; padding-bottom: 10px; padding-left: 10px; padding-right: 10px;'></i></li></div>");
                        }
                    }
                });
                var acceptedIDs = $("#theCanvas").droppable("option", "accept");
                acceptedIDs += ", #" + elementID;
                $("#theCanvas").droppable("option", "accept", acceptedIDs);

                if (onMouseUp) {
                    iVoLVER.draggableIcons[elementID] = onMouseUp;

                }

                if (iVoLVER.gui._paletteSections[sectionID]) {
                    iVoLVER.gui._paletteSections[sectionID].elements.push({
                        id: elementID
                    });
                }



                return elementID;
            },
            fileOpener: function (buttonDescription) {
                var readAs = buttonDescription.readAs || 'Text';
                var sectionID = buttonDescription.sectionID;
                var buttonID = buttonDescription.id || ('fileOpener_' + iVoLVER.util.generateID());
                var tooltip = buttonDescription.tooltip;
                var iconClass = buttonDescription.iconClass;
                var accept = buttonDescription.accept;
                var onLoad = buttonDescription.onLoad;
                var liStyle = iVoLVER.util.isUndefined(buttonDescription.liStyle) || iVoLVER.util.isNull(buttonDescription.liStyle) ? "margin-top: 2px; margin-right: 1%; margin-left: 1%; min-width: 22%; max-width: 22%; width: 22%; margin-bottom: 2px;" : buttonDescription.liStyle;
                var cssClasses = buttonDescription.cssClasses ? buttonDescription.cssClasses.toString().replace(',', ' ') : '';
                var inputID = buttonID + '_input';
                var onChangeFunctionName = 'onchange_' + buttonID;

                window[onChangeFunctionName] = function (files) {
                    var file = files[0];
                    var reader = new FileReader();
                    reader.onload = (function (file) {
                        return function (evt) {
                            var fileContent = evt.target.result;
                            onLoad(fileContent, file);
                        };
                    })(file);
                    if (file) {
                        reader['readAs' + readAs](file);
                        var pepe = $("#" + inputID);
                        pepe.val('');
                    }
                };

                var section = $("#" + sectionID);
                section.append('<li><input type="file" accept="' + accept + '" id="' + inputID + '" onchange="' + onChangeFunctionName + '(this.files)" style="visibility:hidden;position:absolute;top:-50;left:-50"/></li>');

                var theInput = $("#" + inputID);
                var onClickFunctionName = 'onclick_' + buttonID;
                window[onClickFunctionName] = function () {
//                    // console.log("+++++++++++++ theInput:");
//                    // console.log(theInput);
                    theInput.click();
                };

                var liID = buttonID + '_li';

                if (sectionID === iVoLVER.gui.toolbar) {
                    liStyle = "";
                    cssClasses += ' verticalLeftDivider';
                    section.append('<li id="' + liID + '" class="' + cssClasses + '" style="' + liStyle + '"><a onclick="' + onClickFunctionName + '()"><i class="fa ' + iconClass + ' "></i></a></li>');
                } else {
                    liStyle += " float: left;"
                    section.append('<li id="' + liID + '" class="' + cssClasses + '" style="' + liStyle + '"><a onclick="' + onClickFunctionName + '()"><i class="' + iconClass + '"></i></a></li>');
                }




                var li = $("#" + liID);
                if (tooltip) {
                    li.attr('title', tooltip);
                }
                return buttonID;
            },
        },
        sectionTitles: {
            extractors: 'Extractors',
            marks: 'Marks',
            values: 'Values',
            operators: 'Operators',
            collections: 'Collections',
            locators: 'Locators',
            functions: 'Functions'
        },
        progvolverSectionTitles: {
            canvasVariable: 'Canvas variable',
            codeShift: 'Code Multiverses',
            codeNote: 'Code Note',
            plots: 'Notes and Plots',
            signals: 'Signals',
            logicalOperators: 'Variables and Operators',
            multiverse: 'Code Multiverse'
        },
        getSectionByTitle: function (title) {
            var sections = iVoLVER.gui._paletteSections;
            var searchedID = null;
            Object.keys(sections).forEach(function (sectionID) {
                if (sections[sectionID].title === title) {
                    searchedID = sectionID;
                }
            });
            return searchedID;
        },

        addCanvasVariablesSection: function () {
            var canvasVariableSection = iVoLVER.gui.add.iconGroup({
                title: iVoLVER.gui.progvolverSectionTitles.canvasVariable
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: canvasVariableSection,
                iconClass: 'fa-exchange',
                tooltip: 'Canvas variable',
                onMouseUp: function (x, y) {
                    var canvasVariable = new CanvasVariable({
                        type: "dataType",
                        name: "name",
                        left: x,
                        top: y,
                        x: x,
                        y: y,
                        value: ""
                    });
                    canvas.add(canvasVariable);
                    animateBirth(canvasVariable, false, 1, 1);
                }
            });
        },

        addCodeShiftSection: function () {
            var codeShiftSection = iVoLVER.gui.add.iconGroup({
                title: iVoLVER.gui.progvolverSectionTitles.codeShift
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: codeShiftSection,
                iconClass: 'fa-exchange',
                tooltip: 'Code Shift',
                onMouseUp: function (x, y) {
                    var codeControls = new CodeControls({
                        x: x,
                        y: y
                    });
                    canvas.add(codeControls);
                    animateBirth(codeControls, false, 1, 1);
                }
            });
        },

        addCodeNoteSection: function () {
            var codeNoteSection = iVoLVER.gui.add.iconGroup({
                title: iVoLVER.gui.progvolverSectionTitles.codeNote
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: codeNoteSection,
                iconClass: 'fa-exchange',
                tooltip: 'Code Note',
                onMouseUp: function (x, y) {
                    var note = new CodeNote({
                        x: x,
                        y: y,
                        width: 250,
                        height: 250,
                        programElementType: "N",
                        drawIconSpace: true,
                    });
                    canvas.add(note);
                    animateBirth(note, false, 1, 1);
                }
            });
        },

        addSignalsSection: function () {
            var signalsSection = iVoLVER.gui.add.iconGroup({
                title: iVoLVER.gui.progvolverSectionTitles.signals
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: signalsSection,
                iconClass: 'fa-exchange',
                tooltip: 'When Widget',
                onMouseUp: function (x, y) {
                    var whenWidget = new WhenWidget({
                        fill: '#F02466',
                        stroke: '#F02466',
                        width: 180,
                        height: 100,
                        x: x,
                        y: y,
                        left: x,
                        top: y
                    });
                    canvas.add(whenWidget);
                    animateBirth(whenWidget, false, 1, 1);
                }
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: signalsSection,
                iconClass: 'fa-exchange',
                tooltip: 'Affect Widget',
                onMouseUp: function (x, y) {
                    var affectWidget = new AffectWidget({
                        fill: '#F02466',
                        stroke: '#F02466',
                        width: 180,
                        height: 100,
                        x: x,
                        y: y,
                        left: x,
                        top: y
                    });
                    canvas.add(affectWidget);
                    animateBirth(affectWidget, false, 1, 1);
                }
            });

            // iVoLVER.gui.add.draggableIcon({
            //     sectionID: signalsSection,
            //     iconClass: 'fa-exchange',
            //     tooltip: 'Snapshot Widget',
            //     onMouseUp: function (x, y) {
            //         var snapshotWidget = new SnapshotWidget({
            //             fill: '#F02466',
            //             stroke: '#F02466',
            //             x: x,
            //             y: y,
            //             left: x,
            //             top: y
            //         });
            //         canvas.add(snapshotWidget);
            //         animateBirth(snapshotWidget, false, 1, 1);
            //     }
            // });
        },

        addPlotsSection: function () {
            var plotsSection = iVoLVER.gui.add.iconGroup({
                title: iVoLVER.gui.progvolverSectionTitles.plots
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: plotsSection,
                iconClass: 'fa-exchange',
                tooltip: 'Code Note',
                onMouseUp: function (x, y) {
                    var note = new CodeNote({
                        x: x,
                        y: y,
                        width: 250,
                        height: 250,
                        programElementType: "N",
                        drawIconSpace: true,
                    });
                    canvas.add(note);
                    animateBirth(note, false, 1, 1);
                }
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: plotsSection,
                iconClass: 'fa-exchange',
                tooltip: 'Lollipop plot',
                onMouseUp: function (x, y) {
                    var plotter = new LollipopPlot({
                        x: x,
                        y: y,
                        width: 250,
                        height: 250,
                        programElementType: "...",
                        drawIconSpace: true,
                    });
                    canvas.add(plotter);
                    animateBirth(plotter, false, 1, 1);
                }
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: plotsSection,
                iconClass: 'fa-exchange',
                tooltip: 'Scatter plot',
                onMouseUp: function (x, y) {
                    var plotter = new ScatterPlot({
                        x: x,
                        y: y,
                        width: 250,
                        height: 250,
                        programElementType: "...",
                        drawIconSpace: true,
                    });
                    canvas.add(plotter);
                    animateBirth(plotter, false, 1, 1);
                }
            });

        },
        addcodeMultiverseSection: function () {
            var parameters = iVoLVER.gui.add.iconGroup({
                title: iVoLVER.gui.progvolverSectionTitles.multiverse
            });

            var sectionID = parameters;
            var elementID = ('section_element_' + iVoLVER.util.generateID());
            var liStyle = iVoLVER.util.isUndefined(parameters.liStyle) || iVoLVER.util.isNull(parameters.liStyle) ? "margin-top: 2px; margin-right: 1%; margin-left: 1%; min-width: 100%; max-width: 100%; width: 100%; margin-bottom: 2px;" : parameters.liStyle;
            var aStyle = iVoLVER.util.isUndefined(parameters.aStyle) || iVoLVER.util.isNull(parameters.aStyle) ? 'text-align: center;' : parameters.aStyle;
            var iStyle = iVoLVER.util.isUndefined(parameters.iStyle) || iVoLVER.util.isNull(parameters.iStyle) ? 'text-align: center; font-size: 25px;' : parameters.iStyle;

            liStyle += " float: left;";

            var datatypesList = $("#" + sectionID);
            window.codeMultiverseDiv = datatypesList;

            let divContainer = $('<div id="addCodeMultiverseContainer" class="container" </div>');

            let divName = $('<div class="row" style="width:auto">' +
                '<div class="col-12"><button id="addCodeMultiverseButton" type="button" class="btn" style="color:red; width:inherit" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">\n' +
                '  <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>\n' +
                '</svg></button></div>' +
                '</div>');
            // let nameElement = $('');
            // let collapsibleButton = $('')

            let branchElements = $('<div class="row" id="branchElements" style="width: fit-content"</div>');
            // divName.append(nameElement);
            // divName.append(collapsibleButton);
            let codeMultiverse = $('<div class="row" style="width: 110px"><button type="button" id="addCodeVariant" class="btn btn-success" style="color: red" >+</button></div>')

            let myButton = $( "#addCodeVariant" );
            console.log(codeMultiverse);
            console.log(myButton);
            // divName.append(nameElement);
            // divName.append(collapsibleButton);
            divContainer.append(divName);
            //divContainer.append(branchElements);
            //divContainer.append(codeMultiverse);
            let liElement = $('<li id="' + elementID + '" class="description" style="' + liStyle + '">');

            liElement.append(divContainer);
            //datatypesList.append('<li id="' + elementID + '" draggable="true" class="description dragElement" style="' + liStyle + '"><a style="' + aStyle + '"><i class="' + iconClass + '" style="' + iStyle + '"></i></i></a></li>');
            datatypesList.append(liElement);

            var li = $("#" + elementID);

            var acceptedIDs = $("#theCanvas").droppable("option", "accept");
            acceptedIDs += ", #" + elementID;
            $("#theCanvas").droppable("option", "accept", acceptedIDs);

            if (iVoLVER.gui._paletteSections[sectionID]) {
                iVoLVER.gui._paletteSections[sectionID].elements.push({
                    id: elementID
                });
            }

            $( "#addCodeMultiverseButton" ).click(function() {
                addCodeMultiverseToRightPane();
            });

            return elementID;
        },

        addLogicalOperatorsSection: function () {
            var logicalOperatorsSection = iVoLVER.gui.add.iconGroup({
                title: iVoLVER.gui.progvolverSectionTitles.logicalOperators
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: logicalOperatorsSection,
                iconClass: 'fa-exchange',
                tooltip: 'Canvas variable',
                onMouseUp: function (x, y) {
                    var canvasVariable = new CanvasVariable({
                        type: "dataType",
                        name: "name",
                        left: x,
                        top: y,
                        x: x,
                        y: y,
                        value: ""
                    });
                    canvas.add(canvasVariable);
                    animateBirth(canvasVariable, false, 1, 1);
                }
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: logicalOperatorsSection,
                iconClass: 'fa-exchange',
                tooltip: 'Comparison operator',
                onMouseUp: function (x, y) {
                    var comparisonOperator = new ComparisonOperators({
                        x: x,
                        y: y,
                    });
                    canvas.add(comparisonOperator);
                    animateBirth(comparisonOperator, false, 1, 1);
                }
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: logicalOperatorsSection,
                iconClass: 'fa-exchange',
                tooltip: 'Logical operator',
                onMouseUp: function (x, y) {
                    var logicalOperator = new LogicalOperators({
                        x: x,
                        y: y,
                    });
                    canvas.add(logicalOperator);
                    animateBirth(logicalOperator, false, 1, 1);
                }
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: logicalOperatorsSection,
                iconClass: 'fa-exchange',
                tooltip: 'Arithmetic operator',
                onMouseUp: function (x, y) {
                    var arithmeticOperator = new ArithmeticOperators({
                        x: x,
                        y: y,
                    });
                    canvas.add(arithmeticOperator);
                    animateBirth(arithmeticOperator, false, 1, 1);
                }
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: logicalOperatorsSection,
                iconClass: 'fa-exchange',
                tooltip: 'Result Widget',
                onMouseUp: function (x, y) {
                    var resultWidget = new ResultWidget({
                        x: x,
                        y: y,
                    });
                    canvas.add(resultWidget);
                    animateBirth(resultWidget, false, 1, 1);
                }
            });
        },


        addFunctionsSection: function () {
            var functionsSection = iVoLVER.gui.add.iconGroup({
                title: iVoLVER.gui.sectionTitles.functions
            });
            function createContinuosFunction(coordinates, x, y) {
                var theFunction = new iVoLVER.model.ContinuousFunction({
                    left: x,
                    top: y,
                    xCoordinates: !iVoLVER.util.isUndefined(coordinates) && !iVoLVER.util.isNull(coordinates) ? coordinates.XCoordinates : null,
                    yCoordinates: !iVoLVER.util.isUndefined(coordinates) && !iVoLVER.util.isNull(coordinates) ? coordinates.YCoordinates : null,
                    animateBirth: true,
                    compressedProperties: {
                        width: 150,
                        height: 150,
                    },
                    expandedProperties: {
                        width: 350,
                        height: 350,
                    }
                });
                canvas.add(theFunction);
            }
            iVoLVER.gui.add.draggableIcon({
                sectionID: functionsSection,
                iconClass: 'function-empty',
                tooltip: 'Emtpy function',
                onMouseUp: function (x, y) {
                    createContinuosFunction(null, x, y)
                }
            });
            iVoLVER.gui.add.draggableIcon({
                sectionID: functionsSection,
                iconClass: 'function-x',
                tooltip: 'Linear function',
                onMouseUp: function (x, y) {
                    createContinuosFunction(iVoLVER.functionCoordinates.linear(), x, y)
                }
            });
            iVoLVER.gui.add.draggableIcon({
                sectionID: functionsSection,
                iconClass: 'function-x2',
                tooltip: 'Squared function',
                onMouseUp: function (x, y) {
                    createContinuosFunction(iVoLVER.functionCoordinates.quadratic(), x, y)
                }
            });
            iVoLVER.gui.add.draggableIcon({
                sectionID: functionsSection,
                iconClass: 'function-x3',
                tooltip: 'Cubic function',
                onMouseUp: function (x, y) {
                    createContinuosFunction(iVoLVER.functionCoordinates.cubic(), x, y)
                }
            });
            iVoLVER.gui.add.draggableIcon({
                sectionID: functionsSection,
                iconClass: 'function-sinx',
                tooltip: 'Sin function',
                onMouseUp: function (x, y) {
                    createContinuosFunction(iVoLVER.functionCoordinates.sin(), x, y)
                }
            });
            iVoLVER.gui.add.draggableIcon({
                sectionID: functionsSection,
                iconClass: 'function-cosx',
                tooltip: 'Cos function',
                onMouseUp: function (x, y) {
                    createContinuosFunction(iVoLVER.functionCoordinates.cos(), x, y)
                }
            });
            iVoLVER.gui.add.draggableIcon({
                sectionID: functionsSection,
                iconClass: 'function-logx',
                tooltip: 'Log function',
                onMouseUp: function (x, y) {
                    createContinuosFunction(iVoLVER.functionCoordinates.log(), x, y)
                }
            });
            iVoLVER.gui.add.draggableIcon({
                sectionID: functionsSection,
                iconClass: 'function-sqrtx',
                tooltip: 'Sqrt function',
                onMouseUp: function (x, y) {
                    createContinuosFunction(iVoLVER.functionCoordinates.sqrt(), x, y)
                }
            });
        },
        addMarksSection: function () {
            var marksSection = iVoLVER.gui.add.iconGroup({
                title: iVoLVER.gui.sectionTitles.marks
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: marksSection,
                iconClass: 'mark-circle',
                tooltip: 'Circle',
                onMouseUp: function (x, y) {
                    var radius = 20;
                    if (iVoLVER.util.isUndefined(iVoLVER.CircularMark)) {
                        var circleProperties = [
                            {name: 'shape', value: createShapeValue({shape: CIRCULAR_MARK}), readOnly: true},
                            {name: 'color', value: createColorValue({r: 62, g: 167, b: 193})},
                            {name: 'label', value: createStringValue({string: ''})},
                            {name: 'radius', value: createNumberValue({unscaledValue: radius, inPrefix: '', outPrefix: '', units: 'pixels'}), path: paths.radius.rw},
                            {name: 'area', value: createNumberValue({unscaledValue: Math.PI * radius * radius, inPrefix: '', outPrefix: '', units: 'pixels'}), path: paths.area.rw}
                        ];
                        iVoLVER.CircularMark = iVoLVER.obj.Mark.createClass(fabric.Circle, {
                            properties: circleProperties,
                            onPropertyChange: {
                                radius: function (value, withAnimation) {
                                    iVoLVER.util._changeNUmericMarkProperty('radius', this, value, withAnimation);
                                }
                            }
                        });
                    }
                    var circle = new iVoLVER.CircularMark({
                        iVoLVERType: 'CircularMark',
                        radius: radius,
                        strokeWidth: 2,
                        originX: 'center',
                        originY: 'center',
                        left: x,
                        top: y,
                        compressing: true,
                        anchorX: 'center',
                        anchorY: 'center',
                        compressed: true,
                    });
                    canvas.add(circle);
                    animateBirth(circle, false, 1, 1);
                }
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: marksSection,
                iconClass: 'mark-rectangle',
                tooltip: 'Rectangle',
                onMouseUp: function (x, y) {
                    var fill = rgb(205, 100, 145);
                    var width = 45;
                    var height = 100;
                    if (iVoLVER.util.isUndefined(iVoLVER.RectangularMark)) {
                        var rectangleProperties = [
                            {name: 'shape', value: createShapeValue({shape: RECTANGULAR_MARK}), readOnly: true},
                            {name: 'color', value: createColorValue({r: 200, g: 100, b: 145})},
                            {name: 'label', value: createStringValue({string: ''})},
                            {name: 'width', value: createNumberValue({unscaledValue: width, inPrefix: '', outPrefix: '', units: 'pixels'}), path: paths.width.rw},
                            {name: 'height', value: createNumberValue({unscaledValue: height, inPrefix: '', outPrefix: '', units: 'pixels'}), path: paths.height.rw},
                            {name: 'area', value: createNumberValue({unscaledValue: width * height, inPrefix: '', outPrefix: '', units: 'pixels'}), path: paths.area.rw},
                            {name: 'angle', value: createNumberValue({unscaledValue: 0, inPrefix: '', outPrefix: '', units: 'degrees'}), path: paths.angle.rw}
                        ];
                        iVoLVER.RectangularMark = iVoLVER.obj.Mark.createClass(fabric.Rect, {
                            properties: rectangleProperties,
                            onPropertyChange: {
                                width: function (value, withAnimation) {
                                    iVoLVER.util._changeNUmericMarkProperty('width', this, value, withAnimation);
                                },
                                height: function (value, withAnimation) {
                                    iVoLVER.util._changeNUmericMarkProperty('height', this, value, withAnimation);
                                }
                            }
                        });
                    }
                    var rectangle = new iVoLVER.RectangularMark({
                        left: x,
                        top: y,
                        iVoLVERType: 'RectangularMark',
                        width: width,
                        height: height,
                        fill: fill,
                        stroke: darkenrgb(205, 100, 145),
                        strokeWidth: 2,
                        compressing: true,
                        anchorX: 'center',
                        anchorY: 'bottom',
                        originX: 'center',
                        originY: 'center',
                        compressed: true,
                        centerTransform: false
                    });
                    canvas.add(rectangle);
                    animateBirth(rectangle, false, 1, 1);
                }
            });

            iVoLVER.gui.add.draggableIcon({
                sectionID: marksSection,
                iconClass: 'mark-ellipse',
                tooltip: 'Ellipse',
                onMouseUp: function (x, y) {
                    var rx = 60;
                    var ry = 32;
                    var ellipseFill = rgb(232, 195, 69);
                    if (iVoLVER.util.isUndefined(iVoLVER.EllipticalMark)) {
                        var ellipseProperties = [
                            {name: 'shape', value: createShapeValue({shape: ELLIPTIC_MARK}), readOnly: true},
                            {name: 'color', value: createColorValue({r: 232, g: 195, b: 69})},
                            {name: 'label', value: createStringValue()},
                            {name: 'rx', value: createNumberValue({unscaledValue: rx, inPrefix: '', outPrefix: '', units: 'pixels'}), path: paths.rx.rw},
                            {name: 'ry', value: createNumberValue({unscaledValue: ry, inPrefix: '', outPrefix: '', units: 'pixels'}), path: paths.ry.rw},
                            {name: 'area', value: createNumberValue({unscaledValue: Math.PI * rx * ry, inPrefix: '', outPrefix: '', units: 'pixels'}), path: paths.area.rw},
                            {name: 'angle', value: createNumberValue({unscaledValue: 0, inPrefix: '', outPrefix: '', units: 'degrees'}), path: paths.angle.rw}
                        ];
                        iVoLVER.EllipticalMark = iVoLVER.obj.Mark.createClass(fabric.Ellipse, {
                            properties: ellipseProperties,
                            onPropertyChange: {
                                rx: function (value, withAnimation) {
                                    iVoLVER.util._changeNUmericMarkProperty('rx', this, value, withAnimation);
                                },
                                ry: function (value, withAnimation) {
                                    iVoLVER.util._changeNUmericMarkProperty('ry', this, value, withAnimation);
                                }
                            }
                        });
                    }
                    var ellipse = new iVoLVER.EllipticalMark({
                        iVoLVERType: 'EllipticalMark',
                        rx: rx,
                        ry: ry,
                        fill: ellipseFill,
                        stroke: darkenrgb(232, 195, 69),
                        strokeWidth: 2,
                        left: x,
                        top: y,
                        compressing: true,
                        originX: 'center',
                        originY: 'center',
                        anchorX: 'center',
                        anchorY: 'center',
                        compressed: true,
                    });
                    canvas.add(ellipse);
                    animateBirth(ellipse, false, 1, 1);
                }
            });

//            iVoLVER.gui.add.draggableIcon({
//                sectionID: marksSection,
//                iconClass: 'mark-pathMark',
//                tooltip: 'Path',
//                onMouseUp: function (x, y) {
//                    // console.log("TODO: To be implemented...");
//                }
//            });

            iVoLVER.gui.add.fileOpener({
                sectionID: marksSection,
                name: 'createMarkFromSVGFile',
                iconClass: 'mark-svg',
                accept: '.svg',
                tooltip: 'Create mark from SVG file',
                liStyle: 'margin-bottom: 0px;',
                cssClasses: ['dragElement', 'boxDivider'],
                onLoad: function (content, file) {

//                    // console.log("File loaded!");

                    if (iVoLVER.util.isUndefined(iVoLVER.PathGroupMark)) {
                        var pathProperties = [
                            {name: visualPropertiesNames.label, value: createStringValue({string: replaceAll(file.name, ".svg", "")})},
                        ];

                        iVoLVER.SVGObject = iVoLVER.obj.Mark.createClass(fabric.Group, {
                            properties: pathProperties,
                            onPropertyChange: {
//                                radius: default
                            }
                        });




                    }



                    var canvasCenter = getActualCanvasCenter();




                    fabric.loadSVGFromString(content, function (objects, options) {



//                        const canvasItem = fabric.util.groupSVGElements(objects, options);
//                        canvas.add(canvasItem);


                        options.iVoLVERType = 'PathGroupMark';
                        options.objects = objects;
                        options.top = canvasCenter.y;
                        options.left = canvasCenter.x;
                        options.fill = rgb(174, 174, 172);
                        options.stroke = rgb(63, 63, 63);
                        options.strokeWidth = 0;
                        options.compressing = true;
                        options.anchorX = 'center';
                        options.anchorY = 'center';
                        options.originX = 'center';
                        options.originY = 'center';
                        options.compressed = true;






                        var aPathGroupMark = new iVoLVER.SVGObject(options);





                        aPathGroupMark.setCoords && aPathGroupMark.setCoords();
                        canvas.add(aPathGroupMark);
                        animateBirth(aPathGroupMark, false, 1, 1);



                    });
                }
            });
        },
        addValuesSection: function () {
            var valuesSection = iVoLVER.gui.add.iconGroup({
                title: iVoLVER.gui.sectionTitles.values
            });
            iVoLVER._registerCoreDataTypes(valuesSection);
        },
        addOperatorsSection: function () {
            var operatorsSection = iVoLVER.gui.add.iconGroup({
                title: iVoLVER.gui.sectionTitles.operators
            });
            iVoLVER._registerCoreOperators(operatorsSection);
        },
        addExtractorsSection: function () {
            var extractorsSection = iVoLVER.gui.add.iconGroup({
                title: iVoLVER.gui.sectionTitles.extractors,
                noSeparator: true
            });

            /* All of these guys are action buttons and that's not implemented yet*/

        },
        addCollectionsSection: function () {
            var collectionsSection = iVoLVER.gui.add.iconGroup({
                title: iVoLVER.gui.sectionTitles.collections
            });
            iVoLVER.gui.add.draggableIcon({
                sectionID: collectionsSection,
                iconClass: 'collections-collection',
                tooltip: 'Collection',
                liStyle: 'margin-right: 0px; margin-bottom: 0px;',
                aStyle: '',
                iStyle: '',
                onMouseUp: function (x, y) {
                    canvas.add(new iVoLVER.obj.Collection({
                        left: x,
                        top: y,
                        animateBirth: true,
                    }));
                }
            });
            iVoLVER.gui.add.draggableIcon({
                sectionID: collectionsSection,
                iconClass: 'collections-mapper',
                liStyle: 'margin-right: 0px; margin-bottom: 0px;',
                aStyle: '',
                iStyle: '',
                tooltip: 'Mapper',
                onMouseUp: function (x, y) {
                    canvas.add(new iVoLVER.Mapper({
                        left: x,
                        top: y,
                        animateBirth: true
                    }));
                }
            });
            iVoLVER.gui.add.draggableIcon({
                sectionID: collectionsSection,
                iconClass: 'collections-generator',
                tooltip: 'Numeric Collection Generator',
                onMouseUp: function (x, y) {
                    // console.log("TODO: To be implemented...");
                }
            });
        },
        addLocatorsSection: function () {
            var locatorsSection = iVoLVER.gui.add.iconGroup({
                title: iVoLVER.gui.sectionTitles.locators
            });
            iVoLVER.gui.add.draggableIcon({
                sectionID: locatorsSection,
                iconClass: 'locator-cartesian',
                tooltip: 'Cartesian',
                liStyle: 'margin-left: 5px; margin-right: 5px; margin-bottom: 0px; margin-top: 0px;',
                aStyle: '',
                iStyle: '',
                onMouseUp: function (x, y) {
                    canvas.add(new iVoLVER.obj.CartesianLocator({
                        left: x,
                        top: y,
                        compressed: true,
                        animateBirth: true
                    }));
                }
            });
            iVoLVER.gui.add.draggableIcon({
                sectionID: locatorsSection,
                iconClass: 'locator-polar',
                tooltip: 'Polar',
                liStyle: 'margin-left: 5px; margin-right: 5px; margin-bottom: 0px; margin-top: 0px;',
                aStyle: '',
                iStyle: '',
                onMouseUp: function (x, y) {
                    canvas.add(new iVoLVER.obj.PolarLocator({
                        left: x,
                        top: y,
                        compressed: true,
                        animateBirth: true
                    }));
                }
            });
        },
    },
    _assembleValueFromFields: function (typeName, editingFunctionParameters) {
        var valueParameters = {};


        Object.keys(editingFunctionParameters).forEach(function (attribute) {
//            // console.log("attribute: " + attribute);

            var options = editingFunctionParameters[attribute];
            var field = $("#" + options.id);
            var inputValue = field.val();
            if (editingFunctionParameters[attribute].type === 'number') {
                inputValue = parseFloat(inputValue);
            } else if (editingFunctionParameters[attribute].type === 'radio') {
                var checkedRadio = field.find("input:radio:checked");
                inputValue = checkedRadio.val();
            }

//            // console.log("inputValue: " + inputValue);

            valueParameters[attribute] = inputValue;
        });


//        // console.log("valueParameters:");
//        // console.log(valueParameters);

        var functionName = "create" + typeName + "Value";
        return window[functionName](valueParameters);
    },
    _getOptionValue: function (text, options) {
        for (var i = 0; i < options.length; i++) {
            if (text === options[i].text) {
                return options[i].value;
            }
        }
    },
    _getOptionText: function (value, options) {
        for (var i = 0; i < options.length; i++) {
            if (('' + value) === ('' + options[i].value)) {
                return options[i].text;
            }
        }
    },
    _setFieldsValues: function (valueHolder) {
        if (valueHolder.editingParameters) {
            for (var attribute in valueHolder.editingParameters) {
                var options = valueHolder.editingParameters[attribute];
                var id = options.id;
                var fieldValue = null;
                var field = $('#' + id);
                if (options.type === 'radio') {
                    var value = options.value || valueHolder.value[attribute];
                    var allRadios = field.find("input:radio");
                    for (var i = 0; i < allRadios.length; i++) {
                        var theRadio = $(allRadios[i]);
                        if (('' + value) === ('' + theRadio.val())) {
                            theRadio.prop('checked', true);
                            break;
                        }
                    }
                } else if (options.type === 'select') {

//                    // console.log("---------------------------");

                    var value = options.value || valueHolder.value[attribute];

//                    // console.log("value: " + value);
//                    // console.log("field.val() :" + field.val());
//                    // console.log("typeof field.val() :" + typeof field.val());
//                    // console.log("typeof value: " + typeof value);

                    fieldValue = '' + value;



                } else {
                    var value = options.value || valueHolder.value[attribute];
                    fieldValue = value;
                }
                field.val(fieldValue);
            }
        }
    },
    registerEditingFunction: function (typeName, panelTitle, editingFunctionParameters) {

        iVoLVER._configurationFunctions[typeName] = function (valueHolder, allowEditing) {

            valueHolder.editingParameters = editingFunctionParameters;

            hideOpenTooltips();

            var mainDiv = $('#' + typeName + 'Configurator_' + valueHolder.id + '_' + valueHolder.name);

            if (!mainDiv[0]) {

                mainDiv = $('<div/>', {id: typeName + 'Configurator_' + valueHolder.id + '_' + valueHolder.name});

                var padding = (valueHolder.width / 4) * canvas.getZoom();
                mainDiv.css('padding-right', padding + 'px');
                mainDiv.css('padding-left', padding + 'px');

                document.body.appendChild(mainDiv[0]);

                var title = "( " + panelTitle + " )";
                if (valueHolder.name) {
                    title = valueHolder.name + " ( " + typeName + " )";
                }

                var hrColor = iVoLVER.util.isUndefined(valueHolder.value.color) ? valueHolder.fill : "#" + valueHolder.value.color.toHex();

                var valueLabel = $('<p/>', {text: title.toUpperCase(), style: "color: " + hrColor + "; text-align: center; font-weight: bold; font-size: 18px; margin-top: 10px;"});

                var okButton = $('<button/>', {id: generateIDForConfigurationField(valueHolder, 'OK'), text: "OK", class: "square", style: "margin-top: -10px; width: 35%; margin-left: 12%; margin-right: 6%;  border-color: #000; border-style: solid; border-width: 2px; color: black;"});
                var cancelButton = $('<button/>', {id: generateIDForConfigurationField(valueHolder, 'Cancel'), text: "Cancel", class: "square", style: "margin-top: -10px; width: 35%; border-color: #000; border-style: solid; border-width: 2px; color: black; "});

                okButton.click(function () {

                    var assembledValue = iVoLVER._assembleValueFromFields(typeName, editingFunctionParameters);

//                    // console.log("assembledValue:");
//                    // console.log(assembledValue);

                    var oldValue = valueHolder.value;
                    var sameValue = false;
                    if (oldValue.equals) {
                        sameValue = oldValue.equals(assembledValue);
                    }
                    if (!sameValue) {
                        // removing the incoming connection associated to this value
                        // this should not be done when the connectable element is allowed to have several incoming connections
                        if (valueHolder.inConnections.length > 0) {
                            var connector = valueHolder.inConnections.pop();
                            if (connector) {
                                connector.contract();
                            }
                        }
                    }
                    valueHolder.setValue(assembledValue, true);
                    mainDiv.tooltipster('hide');
                });

                cancelButton.click(function () {
                    mainDiv.tooltipster('hide');
                });

                var divs = new Array();

                // generating the IDs that the given attributes will have for their corresponding HTML elements
                for (var attribute in editingFunctionParameters) {
                    var options = editingFunctionParameters[attribute];
                    options.id = generateIDForConfigurationField(valueHolder, attribute, options.type);
                }

                for (var attribute in editingFunctionParameters) {
                    var options = editingFunctionParameters[attribute];

                    var divStyle = 'margin-top: 12px;';
                    if (options.divStyle) {
                        divStyle += options.divStyle;
                    }
                    var div = $('<div />', {style: divStyle, id: iVoLVER.util.generateID()});

                    var theLabel = null;
                    var fieldLabel = null;
                    if (iVoLVER.util.isUndefined(options.label) || iVoLVER.util.isNull(options.label)) {
                        theLabel = capitalizeFirstLetter(attribute) + ":";
                    } else {
                        theLabel = capitalizeFirstLetter(options.label);
                        if (options.label !== '') {
                            theLabel += ":";
                        }
                    }
                    if (theLabel !== '') {
                        fieldLabel = $('<label/>', {text: theLabel, style: "font-size: 18px; margin-right: 5px; margin-top: 10px; margin-left: 3px; float: left;"});
                    }

                    var value = options.value || valueHolder.value[attribute];

                    var style = 'font-size: 18px; margin-right: 10px; margin-top: 3px; height: 30px;';
                    if (options.type !== 'select') {
                        var width = options.type === 'number' ? 75 : 100;
                        style += 'width: ' + width + 'px;';
                    }

                    if (options.style) {
                        style += options.style;
                    }

                    var field = null;
                    var fieldID = options.id;

                    if (options.type === 'label') {

                        style += 'margin-top: 20px; max-width: 100%;';
                        var text = options.text;
                        field = $('<label />', {id: fieldID, text: text, style: style});

                    } else if (options.type === 'color') {

                        field = $('<input />', {id: fieldID, style: style, value: valueHolder.value.color.toHex()});

                    } else if (options.type === 'radio') {

                        style += "width: auto; height: auto; margin-left: 10px; display: table;";

                        field = $('<div />', {id: fieldID, style: style + 'padding-top: 9px;'});
                        field.empty();

                        options.options.forEach(function (item, i) {

                            var itemText = null;
                            var itemValue = null;

                            if (iVoLVER.util.isObject(item)) {
                                itemText = item.text;
                                itemValue = iVoLVER.util.isUndefined(item.value) || iVoLVER.util.isNull(item.value) ? itemText : item.value;
                            } else if (iVoLVER.util.isString(item)) {
                                itemText = item;
                            }

                            if (iVoLVER.util.isUndefined(itemValue) || iVoLVER.util.isNull(itemValue)) {
                                itemValue = itemText;
                            }

                            var radioButtonID = fieldID + "_" + (i + 1);

                            var currentDivStyle = 'margin-right: 10px; ';
                            if (options.vertical) {
                                currentDivStyle += "display: block;";
                            } else {
                                currentDivStyle += " display: inline;";
                            }

                            var currentDiv = $('<div />', {style: currentDivStyle});

                            var currentRadioButton = $('<input />', {type: "radio", id: radioButtonID, name: fieldID, text: itemText, value: itemValue, style: "width: 21px; height: 21px; border: none; outline: none; box-shadow: none;"});

                            var currentLabel = $('<label />', {for : radioButtonID, style: 'margin-left: 3px;'});
                            currentLabel.append(itemText);

                            currentDiv.append(currentRadioButton);
                            currentDiv.append(currentLabel);

                            field.append(currentDiv);

                        });

                    } else if (options.type === 'checkbox') {

                        style += "outline: none; box-shadow: none; width: 40px;";
                        field = $('<input />', {type: 'checkbox', id: fieldID, style: style});

                    } else if (options.type === 'select') {

                        field = $('<select />', {id: fieldID, style: style});
                        field.empty();

                        options.options.forEach(function (item) {

                            // console.log("New item *****************");

                            var itemText = null;
                            var itemValue = null;

                            if (iVoLVER.util.isObject(item)) {
                                itemText = item.text;
                                itemValue = iVoLVER.util.isUndefined(item.value) || iVoLVER.util.isNull(item.value) ? itemText : item.value;
                            } else if (iVoLVER.util.isString(item)) {
                                itemText = item;
                            }

//                            // console.log("itemValue");
//                            // console.log(itemValue);
//                            // console.log("typeof itemValue");
//                            // console.log(typeof itemValue);
//
//                            // console.log("value");
//                            // console.log(value);
//                            // console.log("typeof value");
//                            // console.log(typeof value);

//                            // console.log(itemValue === value);

                            var currentOption = $('<option />', {value: itemValue, selected: itemValue === value});
                            currentOption.append(itemText);
                            currentOption.appendTo(field);
                        });

                    } else {
                        field = $('<input />', {id: fieldID, type: options.type || 'text', style: style, value: value});
                    }

                    field.prop('disabled', options.disabled);
                    field.data('valueAttribute', attribute);
                    field.data('valueHolderID', valueHolder.id);

                    if (options.type === 'number' || options.type === 'text') {

                        associateEnterEvent(field, okButton);

                        var modificationFunction = function () {
                            var tmpValue = iVoLVER._assembleValueFromFields(typeName, editingFunctionParameters);

//                            // console.log("tmpValue:");
//                            // console.log(tmpValue);

                            var valueAttribute = $(this).data('valueAttribute');
                            var affectedAttributes = editingFunctionParameters[valueAttribute].affectsTo;

//                            // console.log(affectedAttributes);

                            if (affectedAttributes) {
                                affectedAttributes.forEach(function (attr) {
                                    if (attr !== valueAttribute) {
                                        var opt = editingFunctionParameters[attr];
                                        var compute = opt.computeAs;
                                        if (compute) {
                                            var fieldValue = compute(tmpValue);
                                            var id = valueHolder.editingParameters[attr].id;
                                            $("#" + id).val(fieldValue);
                                        }
                                    }
                                });
                            }
                        };

                        field.change(modificationFunction);
                        field.keyup(modificationFunction);

                    } else if (options.type === 'select' || options.type === 'checkbox') {
                        var changeFunction = options.onchange;
                        if (!iVoLVER.util.isUndefined(changeFunction) && !iVoLVER.util.isNull(changeFunction)) {
                            field.change(function () {
                                changeFunction(valueHolder);
                            });
                        }
                    }

                    if (fieldLabel) {
                        div.append(fieldLabel);
                    }
                    div.append(field);

                    if (options.type === 'color') {
                        field.spectrum({
                            color: valueHolder.value.color.toHex(),
                            flat: true,
                            showInput: false,
                            showButtons: false,
                            allowEmpty: false,
                            showInitial: true,
                            move: function (tinycolor) {
                                var changeFunction = options.onchange;
                                if (changeFunction) {
                                    changeFunction(valueHolder, tinycolor);
                                }
                            }
                        });

                    }

                    divs.push(div);

                    if (options.breakAfter) {
                        divs.push($('<br/>'));
                    }
                }

                var configurationPanel = $('<div/>', {id: 'configurationPanel_' + valueHolder.id + '_' + valueHolder.name, style: 'min-width: 220px;'});

                configurationPanel.append(valueLabel);

                divs.forEach(function (div) {
                    configurationPanel.append(div);
                });

                configurationPanel.append($('<br />'));
                configurationPanel.append($('<hr />', {style: "margin-top: 0px; margin-bottom: 15px; border-bottom: 1px solid " + hrColor}));
                configurationPanel.append($('<br />'));
                configurationPanel.append(okButton);
                configurationPanel.append(cancelButton);

                mainDiv.tooltipster({
                    content: configurationPanel,
                    animation: 'grow',
                    interactive: true,
                    position: valueHolder.tooltipPosition || 'right',
                    theme: 'tooltipster-borderless',
                    autoClose: true,
                    trigger: 'custom',
                    triggerClose: {
                        mouseleave: false
                    }
                });

                valueHolder.configurator = mainDiv;
            }

            // positioning and showing the configurator
            var centerPoint = valueHolder.getPointByOrigin('center', 'center');
            var screenCoords = getScreenCoordinates(centerPoint);
            mainDiv.css('position', 'absolute');
            mainDiv.css('top', screenCoords.y + 'px');
            mainDiv.css('left', screenCoords.x + 'px');

            mainDiv.tooltipster('open');

            // updating the position of the dragger element in case the configuration panel contains a spectrum color chooser
            var spectrumInputField = valueHolder.getConfigurationField('colorChooser');
            if (!iVoLVER.util.isUndefined(spectrumInputField) && !iVoLVER.util.isNull(spectrumInputField)) {
                spectrumInputField.spectrum("reflow");
            }

            iVoLVER._setFieldsValues(valueHolder);

            mainDiv.tooltipster('reposition');



        };
    },
    getObjectByID: function (id) {
        return iVoLVER._objects[id];
    },
    _registerObject: function (object) {
        if (iVoLVER.util.isUndefined(object.id) || iVoLVER.util.isNull(object.id)) {
            object.id = iVoLVER.util.generateID();
        }
        iVoLVER._objects[object.id] = object;
        iVoLVER._graph.setNode(object.id, object);
    },
    _registerConnection: function (sourceID, destinationID, theConnector) {
//        // console.log("Registering connection with ID: " + theConnector.id);
        iVoLVER._connections[theConnector.id] = theConnector;
        iVoLVER._graph.setEdge(sourceID, destinationID, theConnector);
    },
    getObject: function (id) {
        return iVoLVER._objects[id];
    },
    getConnection: function (id) {
        return iVoLVER._connections[id];
    },
    removeObject: function (id) {
        delete iVoLVER._objects[id];
    },
    undo: function () {
        if (iVoLVER._undoManager.hasUndo()) {
            iVoLVER._undoManager.undo();
        }
    },
    redo: function () {
        if (iVoLVER._undoManager.hasRedo()) {
            iVoLVER._undoManager.redo();
        }
    },
    registerUndoRedo: function (functions) {
        iVoLVER._undoManager.add(functions);
    },
    _registerNumberDataType: function (sectionID) {
        iVoLVER.data.registerType({
            sectionID: sectionID,
            name: 'Number',
            iconPath: 'M 17.3125,10.1875 22.84375,10.1875 22.84375,18.15625 27.78125,18.15625 27.78125,10.1875 33.3125,10.1875 33.3125,18.15625 39.09375,18.15625 39.09375,23.34375 33.3125,23.34375 33.3125,27.15625 39.09375,27.15625 39.09375,32.34375 33.3125,32.34375 33.3125,40.40625 27.78125,40.40625 27.78125,32.34375 22.84375,32.34375 22.84375,40.40625 17.3125,40.40625 17.3125,32.34375 11.53125,32.34375 11.53125,27.15625 17.3125,27.15625 17.3125,23.34375 11.53125,23.34375 11.53125,18.15625 17.3125,18.15625 Z M 22.84375,23.34375 22.84375,27.15625 27.78125,27.15625 27.78125,23.34375 Z',
            fillColor: 'rgb(2,128,204)',
            iconClass: 'value-number',
            nSamples: 15000,
            serializable: ['unscaledValue', 'inPrefix', 'outPrefix', 'units'],
            defaults: {unscaledValue: 100},
            getDisplayableString: function () {
                var decimalPositions = 2;
                var theString = this.number.toFixed(decimalPositions) + " " + (this.outPrefix ? this.outPrefix.trim() : "") + (this.units ? this.units.trim() : "");
                return theString.trim();
            },
            init: function (parameters) {
                var unscaledValue = parameters.unscaledValue;
                var inPrefix = parameters.inPrefix || '';
                var outPrefix = parameters.outPrefix || '';
                var units = parameters.units || '';
                var inMultiplicationFactor = getMultiplicationFactor(inPrefix);
                var outMultiplicationFactor = getMultiplicationFactor(outPrefix);
                var scaledValue = generateScaledValue(unscaledValue, inMultiplicationFactor, outMultiplicationFactor);
                return new iVoLVER.model.Value({number: scaledValue, unscaledValue: unscaledValue, inPrefix: inPrefix, outPrefix: outPrefix, units: units, inMultiplicationFactor: inMultiplicationFactor, outMultiplicationFactor: outMultiplicationFactor});
            },
            equals: function (anotherNumber) {
                var thisNumber = this;
                if (anotherNumber.inPrefix === thisNumber.inPrefix) {
                    return (anotherNumber.unscaledValue === thisNumber.unscaledValue);
                }
                var convertedNumber = createNumberValue({
                    unscaledValue: anotherNumber.unscaledValue,
                    inPrefix: anotherNumber.inPrefix,
                    outPrefix: thisNumber.inPrefix,
                    units: thisNumber.units
                });
                return (convertedNumber.number === thisNumber.unscaledValue);
            },
            onEditing: {
                unscaledValue: {type: 'number', label: 'Number', style: 'width: 65px;', divStyle: 'float: left;'},
                inPrefix: {type: 'select', label: '', style: 'width: auto;', options: metricPrefixes, divStyle: 'float: left;'},
                units: {type: 'text', label: '', style: 'width: 85px;', breakAfter: true, divStyle: 'float: left; margin-bottom: 15px;'},
                outPrefix: {type: 'select', label: 'Output as', options: metricPrefixes, divStyle: 'float: left;'},
                outputLabel: {type: 'label', label: '', divStyle: 'float: left; margin-bottom: 15px;', text: "'(' + this.number + ' ' + this.units + ')'", shouldEval: true},
            },
            operations: {
//                add: function (anotherNumber) {
//                    if (!anotherNumber) {
//                        return this;
//                    } else {
//                        var sum = this.unscaledValue + anotherNumber.unscaledValue;
//                        return createNumberValue({unscaledValue: sum});
//                    }
//                },
                add: {
                    Number: function (anotherNumber) {
                        if (!anotherNumber) {
                            return this;
                        } else {
                            var sum = this.unscaledValue + anotherNumber.unscaledValue;
                            return createNumberValue({unscaledValue: sum});
                        }
                    },
                    String: function (aString) {
                        return createStringValue({string: this.getDisplayableString() + '' + aString.string});
                    },
                },
                subtract: function (anotherNumber) {
                    if (!anotherNumber) {
                        return this;
                    } else {
                        var sum = this.unscaledValue - anotherNumber.unscaledValue;
                        return createNumberValue({unscaledValue: sum});
                    }
                },
                multiply: function (anotherNumber) {
                    if (!anotherNumber) {
                        return this;
                    } else {
                        var sum = this.unscaledValue * anotherNumber.unscaledValue;
                        return createNumberValue({unscaledValue: sum});
                    }
                },
                divide: function (anotherNumber) {
                    if (!anotherNumber) {
                        return this;
                    } else {
                        var sum = this.unscaledValue / anotherNumber.unscaledValue;
                        return createNumberValue({unscaledValue: sum});
                    }
                }
            }
        });
    },
    _registerColorDataType: function (sectionID) {
        iVoLVER.data.registerType({
            sectionID: sectionID,
            name: 'Color',
            iconPath: 'M -1730.7481,2920.4031 C -1729.2709,2922.9461 -1727.7195,2925.2545 -1726.249,2927.3916 -1724.7785,2929.5287 -1723.392,2931.4979 -1722.1699,2933.3603 -1720.9478,2935.2226 -1719.9025,2936.9807 -1719.1706,2938.6992 -1718.8046,2939.5583 -1718.5288,2940.4007 -1718.3307,2941.2486 -1718.1326,2942.0963 -1718.0308,2942.9452 -1718.0308,2943.7981 -1718.0308,2944.6509 -1718.1312,2945.4838 -1718.3008,2946.2875 -1718.4704,2947.0911 -1718.6985,2947.8588 -1719.0206,2948.597 -1719.6648,2950.0734 -1720.5981,2951.4104 -1721.75,2952.5262 -1722.9019,2953.6417 -1724.2759,2954.542 -1725.7991,2955.1656 -1726.5607,2955.4772 -1727.3698,2955.7513 -1728.1986,2955.9154 -1729.0275,2956.0795 -1729.869,2956.1554 -1730.7481,2956.1554 -1731.6271,2956.1554 -1732.4954,2956.0795 -1733.3275,2955.9154 -1734.1596,2955.7513 -1734.9602,2955.4773 -1735.727,2955.1656 -1737.2602,2954.5419 -1738.6461,2953.6418 -1739.8061,2952.5262 -1740.9661,2951.4104 -1741.8974,2950.0734 -1742.5355,2948.597 -1742.8544,2947.8588 -1743.0947,2947.0911 -1743.2553,2946.2875 -1743.4159,2945.4838 -1743.4817,2944.6508 -1743.4653,2943.7981 -1743.4437,2942.6544 -1743.3242,2941.6168 -1743.1054,2940.6187 -1742.8867,2939.6205 -1742.5891,2938.6695 -1742.2056,2937.7694 -1741.4385,2935.9687 -1740.3791,2934.3359 -1739.1462,2932.6405 -1737.9133,2930.9452 -1736.5079,2929.1831 -1735.0671,2927.2117 -1733.6265,2925.2402 -1732.1387,2923.0322 -1730.7481,2920.4031 Z',
            fillColor: 'rgb(112, 112, 112)',
            iconClass: 'value-color',
            nSamples: 100,
            defaults: {r: '87', g: '156', b: '169', a: '1'},
            serializable: ['r', 'g', 'b', 'a'],
            init: function (parameters) {
                var r = parameters.r;
                var g = parameters.g;
                var b = parameters.b;
                var a = parameters.a || 1;
                var color = new fabric.Color('rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')');
                return new iVoLVER.model.Value({color: color, r: r, g: g, b: b, a: a});
            },
            getDisplayableString: function () {
                return this.color.toRgb();
            },
            onEditing: {
                r: {type: 'number', style: 'width: 55px;', divStyle: 'float: left;'},
                g: {type: 'number', style: 'width: 55px;', divStyle: 'float: left;'},
                b: {type: 'number', style: 'width: 55px;', divStyle: 'float: left;'},
                a: {type: 'number', style: 'width: 55px;', divStyle: 'float: left;', breakAfter: true},
                selectOnDragging: {type: 'checkbox', label: 'Set color while dragging?', divStyle: 'margin-top: 40px;', onchange: function (valueHolder) {
                        var selectOnDragging = valueHolder.getConfigurationField('selectOnDragging').prop('checked');
                        valueHolder.setEnableConfigurationButton('Cancel', !selectOnDragging);
                        // the moment the checkbox is clicked, if checked, we have to update the output color
                        if (selectOnDragging) {
                            var r = parseInt(valueHolder.getConfigurationField('r').val());
                            var g = parseInt(valueHolder.getConfigurationField('g').val());
                            var b = parseInt(valueHolder.getConfigurationField('b').val());
                            var a = parseInt(valueHolder.getConfigurationField('a').val());
                            var newColorValue = createColorValue({r: r, g: g, b: b, a: a});
                            valueHolder.setValue(newColorValue, false);
                        }
                    }},
                colorChooser: {type: 'color', label: '', divStyle: 'margin-top: 0px; margin-bottom: -10px;', onchange: function (valueHolder, tinycolor) {
                        var r = Math.round(tinycolor._r);
                        var g = Math.round(tinycolor._g);
                        var b = Math.round(tinycolor._b);
                        var a = Math.round(tinycolor._a);
                        valueHolder.getConfigurationField('r').val(r);
                        valueHolder.getConfigurationField('g').val(g);
                        valueHolder.getConfigurationField('b').val(b);
                        valueHolder.getConfigurationField('a').val(a);
                        // if the checkbox is checked, the color of the value holder is inmediately changed during the dragging
                        if (valueHolder.getConfigurationField('selectOnDragging').prop('checked')) {
                            var newColorValue = createColorValue({r: r, g: g, b: b, a: a});
                            valueHolder.setValue(newColorValue, false);
                        }
                    }},
            },
            afterRender: function (ctx) {
                var theValueHolder = this;

                var angle = 32;
                var initialAngle = -angle;
                var endAngle = 180 + angle;
                var r = 7;
                var fillStyle = "#" + theValueHolder.value.color.toHex();
                var rgbColor = hexToRGB(fillStyle);
                var strokeStyle = darkenrgb(rgbColor.r, rgbColor.g, rgbColor.b);
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = strokeStyle;
                ctx.fillStyle = fillStyle;

                // 1111111
                /*ctx.moveTo(0, -10.6);
                 ctx.lineTo(r * Math.cos(fabric.util.degreesToRadians(initialAngle)), 4.7 + (r) * Math.sin(fabric.util.degreesToRadians(initialAngle)));
                 ctx.arc(0, 4.7, r, fabric.util.degreesToRadians(initialAngle), fabric.util.degreesToRadians(endAngle));*/

                // 22222222
//                    ctx.arc(0, 4.7, r, fabric.util.degreesToRadians(initialAngle), fabric.util.degreesToRadians(endAngle));

                // 33333333
                ctx.arc(0, 4.7, r, fabric.util.degreesToRadians(0), fabric.util.degreesToRadians(213));


                ctx.closePath();

                ctx.fill();
                ctx.stroke();


                ctx.restore();
            }
        });
    },
    _registerStringDataType: function (sectionID) {
        iVoLVER.data.registerType({
            sectionID: sectionID,
            name: 'String',
            iconPath: 'M -216.59695,-89.121095 -216.59695,-76.63672 -211.55671,-76.63672 C -211.55671,-76.63672 -211.58097,-71.221935 -212.64243,-69.365236 -213.7038,-67.508526 -214.95196,-66.472658 -214.95196,-66.472658 L -213.11745,-64.347658 C -213.11745,-64.347658 -207.90687,-67.314305 -205.78405,-70.470704 -203.66134,-73.627194 -203.31449,-78.658526 -203.30371,-81.115236 L -203.27095,-89.121095 Z M -198.21965,-89.121095 -198.21965,-76.63672 -193.17941,-76.63672 C -193.17941,-76.63672 -193.20367,-71.221935 -194.26515,-69.365236 -195.3265,-67.508526 -196.57467,-66.472658 -196.57467,-66.472658 L -194.74015,-64.347658 C -194.74015,-64.347658 -189.52725,-67.314305 -187.40442,-70.470704 -185.28171,-73.627194 -184.34083,-78.729312 -184.92641,-81.115236 L -184.89131,-89.121095 Z',
            fillColor: 'rgb(235,50,99)',
            iconClass: 'value-string',
            defaults: {string: ''},
            serializable: ['string'],
//            nSamples: 500,
            nSamples: 50,
            getDisplayableString: function () {
                return this.string;
            },
            equals: function (anotherString) {
                var thisString = this;
                return (thisString.string === anotherString.string);
            },
            onEditing: {
                string: {type: 'text', label: 'Text', style: 'width: 150px;'},
            },
            operations: {
                add: {
                    String: function (anotherString) {
                        var text = this.string + '' + anotherString.string;
                        return createStringValue({string: text});
                    },
                    Number: function (aNumber) {
                        var text = this.string + '' + aNumber.getDisplayableString();
                        return createStringValue({string: text});
                    },
                    DateAndTime: function (aDate) {
                        var text = this.string + '' + aDate.getDisplayableString();
                        return createStringValue({string: text});
                    },
                    Duration: function (aDuration) {
                        var text = this.string + '' + aDuration.getDisplayableString();
                        return createStringValue({string: text});
                    },
                    Color: function (aColor) {
                        var text = this.string + '' + aColor.getDisplayableString();
                        return createStringValue({string: text});
                    }
                }
            }
        });
    },
    _registerDateAndTimeDataType: function (sectionID) {
        iVoLVER.data.registerType({
            sectionID: sectionID,
            name: 'Date And Time',
            iconPath: 'M -80.71875,-55.75 -76.59375,-55.75 -76.59375,-51.96875 -68.5625,-51.96875 -68.5625,-55.75 -64.46875,-55.75 -64.46875,-51.96875 -62.28125,-51.96875 -62.28125,-35.4375 -82.875,-35.4375 -82.875,-51.96875 -80.71875,-51.96875 Z M -78.65625,-47.34375 -78.65625,-45.3125 -76.71875,-45.3125 -76.71875,-47.34375 Z M -73.6875,-47.34375 -73.6875,-45.3125 -71.75,-45.3125 -71.75,-47.34375 Z M -68.71875,-47.34375 -68.71875,-45.3125 -66.78125,-45.3125 -66.78125,-47.34375 Z M -53.4375,-43.34375 C -53.2833,-43.35575 -53.12505,-43.34375 -52.96875,-43.34375 -52.34375,-43.34375 -51.74545,-43.2458 -51.15625,-43.125 -50.56675,-43.0049 -49.979,-42.854 -49.4375,-42.625 -48.8961,-42.3959 -48.3566,-42.1378 -47.875,-41.8125 -47.3936,-41.4872 -46.972,-41.097 -46.5625,-40.6875 -46.1529,-40.278 -45.79405,-39.82525 -45.46875,-39.34375 -45.14345,-38.86215 -44.854,-38.32275 -44.625,-37.78125 -44.396,-37.23975 -44.21425,-36.7145 -44.09375,-36.125 -43.97365,-35.5357 -43.90625,-34.90635 -43.90625,-34.28125 -43.90625,-33.65615 -43.97225,-33.05815 -44.09375,-32.46875 -44.21385,-31.87935 -44.396,-31.2916 -44.625,-30.75 -44.854,-30.2085 -45.14345,-29.70045 -45.46875,-29.21875 -45.79405,-28.73725 -46.1529,-28.2845 -46.5625,-27.875 -46.972,-27.4656 -47.3936,-27.10645 -47.875,-26.78125 -48.3566,-26.45585 -48.8961,-26.1666 -49.4375,-25.9375 -49.979,-25.7086 -50.56675,-25.52685 -51.15625,-25.40625 -51.74545,-25.28615 -52.34375,-25.25 -52.96875,-25.25 -53.59385,-25.25 -54.19185,-25.28495 -54.78125,-25.40625 -55.37075,-25.52635 -55.9585,-25.7086 -56.5,-25.9375 -57.0414,-26.1666 -57.54975,-26.45585 -58.03125,-26.78125 -58.51275,-27.10645 -58.9655,-27.4656 -59.375,-27.875 -59.7843,-28.2845 -60.14345,-28.73725 -60.46875,-29.21875 -60.79415,-29.70045 -61.05225,-30.2085 -61.28125,-30.75 -61.51005,-31.2916 -61.6921,-31.87935 -61.8125,-32.46875 -61.9327,-33.05815 -62,-33.65615 -62,-34.28125 -62,-34.90635 -61.933,-35.5357 -61.8125,-36.125 -61.6924,-36.7145 -61.51005,-37.23975 -61.28125,-37.78125 -61.05225,-38.32275 -60.79415,-38.86215 -60.46875,-39.34375 -60.14345,-39.82525 -59.7843,-40.278 -59.375,-40.6875 -58.9655,-41.097 -58.51275,-41.4872 -58.03125,-41.8125 -57.54975,-42.1378 -57.0414,-42.3959 -56.5,-42.625 -55.9585,-42.854 -55.37075,-43.0045 -54.78125,-43.125 -54.33925,-43.216 -53.9005,-43.31715 -53.4375,-43.34375 Z M -78.65625,-42.0625 -78.65625,-40.03125 -76.71875,-40.03125 -76.71875,-42.0625 Z M -73.6875,-42.0625 -73.6875,-40.03125 -71.75,-40.03125 -71.75,-42.0625 Z M -68.71875,-42.0625 -68.71875,-40.03125 -66.78125,-40.03125 -66.78125,-42.0625 Z M -53.59375,-39.9375 C -53.99525,-39.9375 -54.3125,-39.60195 -54.3125,-39.15625 -54.3125,-37.1875 -54.3125,-35.21875 -54.3125,-33.25 L -50.09375,-29.15625 C -49.77465,-28.84515 -49.31155,-28.80605 -49.03125,-29.09375 -48.75095,-29.38125 -48.77495,-29.8763 -49.09375,-30.1875 L -52.875,-33.875 -52.875,-39.15625 C -52.875,-39.60195 -53.19225,-39.9375 -53.59375,-39.9375 Z',
            fillColor: '#F9C40A',
            iconClass: 'value-dateAndTime',
//            nSamples: 500,
            nSamples: 50,
            serializable: ['date', 'time'],
            defaults: function () {
                var now = moment();
                return {date: now.format('YYYY-MM-DD'), time: now.format('HH:mm:ss'), moment: now}; // this object will get to the init method
            },
            init: function (parameters) {
                var date = parameters.date;
                var time = parameters.time;
                var theMoment = parameters.moment;
                if (!theMoment) {
                    var input = date + " -- " + time;
                    theMoment = moment(input, "YYYY-MM-DD" + " -- " + "HH:mm:ss");
                }
                return new iVoLVER.model.Value({date: date, time: time, moment: theMoment});
            },
            getDisplayableString: function () {
                var date = this.moment.format('DD MMMM YYYY');
                var time = this.moment.format('HH:mm:ss');
                if (time === '00:00:00') {
                    return date;
                } else {
                    return date + "\n" + time;
                }
            },
            onEditing: {
                date: {type: 'date', style: 'width: 190px;'},
                time: {type: 'time', style: 'width: 140px;'}
            },
            operations: {
                add: {
                    Duration: function (aDuration) {
                        var theDate = this.moment;
                        var theDuration = aDuration.duration;
                        var newDate = theDate.clone().add(theDuration);
                        return createDateAndTimeValue({date: newDate.format('YYYY-MM-DD'), time: newDate.format('HH:mm:ss')});
                    },
                    String: function (aString) {
                        var text = this.getDisplayableString() + aString.getDisplayableString();
                        return createStringValue({string: text});
                    }
                },
                divide: {
                    Number: function (aNumber) {
                        return aNumber;
                    }
                },
            }
        });
    },
    _registerDurationDataType: function (sectionID) {
        iVoLVER.data.registerType({
            sectionID: sectionID,
            name: 'Duration',
            iconPath: 'M 245.9069,119.5508 C 242.51173,119.5508 239.7194,121.04617 239.7194,122.89455 239.7194,124.17251 241.06649,122.98703 243.00065,123.5508 L 243.00065,127.70705 C 242.89419,127.72765 242.79328,127.74805 242.68815,127.76955 241.66735,127.97821 240.68837,128.27935 239.75065,128.6758 238.81281,129.07244 237.92839,129.51884 237.0944,130.08205 236.2606,130.64536 235.52228,131.31042 234.81315,132.01955 234.10404,132.72867 233.40771,133.52941 232.8444,134.3633 232.28092,135.19721 231.86604,136.11289 231.4694,137.0508 231.07305,137.98844 230.74066,138.905 230.5319,139.9258 230.32305,140.94641 230.2194,142.03084 230.2194,143.1133 230.2194,144.19577 230.32314,145.24894 230.5319,146.26955 230.74064,147.29026 231.07304,148.30049 231.4694,149.2383 231.86605,150.17613 232.28092,151.06056 232.8444,151.89455 233.40771,152.72845 234.10403,153.49793 234.81315,154.20705 235.52229,154.91616 236.26059,155.54992 237.0944,156.1133 237.92839,156.67662 238.81282,157.18542 239.75065,157.58205 240.68838,157.97852 241.66735,158.27956 242.68815,158.4883 243.70877,158.69706 244.76194,158.8008 245.8444,158.8008 246.92677,158.8008 248.01128,158.697 249.0319,158.4883 250.05261,158.27956 251.09409,157.97852 252.0319,157.58205 252.96964,157.18542 253.82291,156.67662 254.6569,156.1133 255.49081,155.54992 256.29152,154.91617 257.00065,154.20705 257.70985,153.49793 258.3436,152.72845 258.9069,151.89455 259.47021,151.06056 259.88526,150.17613 260.2819,149.2383 260.67835,148.30048 261.0419,147.29026 261.25065,146.26955 261.4594,145.24894 261.5319,144.19577 261.5319,143.1133 261.5319,142.03084 261.4594,140.94641 261.25065,139.9258 261.0419,138.90501 260.67835,137.98844 260.2819,137.0508 259.99343,136.36868 259.70229,135.6865 259.3444,135.0508 259.4712,134.94751 259.59037,134.85187 259.7194,134.7383 260.08676,134.41454 260.28465,133.97053 260.31315,133.51955 260.34155,133.06857 260.1994,132.63689 259.87565,132.26955 L 258.12565,130.26955 C 257.47814,129.53483 256.36038,129.43452 255.62565,130.08205 255.45726,130.20881 255.30823,130.32757 255.1569,130.45705 254.98864,130.33303 254.82848,130.19796 254.6569,130.08205 253.82291,129.51884 252.96964,129.07244 252.0319,128.6758 251.09409,128.27935 250.05261,127.97821 249.0319,127.76955 248.9527,127.75365 248.8615,127.7534 248.7819,127.7383 L 248.7819,123.5508 C 250.70741,122.98555 252.0319,124.16903 252.0319,122.89455 252.0319,121.04616 249.30208,119.5508 245.9069,119.5508 Z M 245.33179,133.20757 C 245.50315,133.19771 245.67192,133.20757 245.84544,133.20757 246.53948,133.20757 247.24559,133.28519 247.90003,133.41907 248.55454,133.55287 249.2022,133.73893 249.80355,133.99315 251.03328,134.511 252.09734,135.23533 252.97608,136.10817 253.43085,136.56288 253.85367,137.08419 254.21488,137.6189 254.57609,138.15362 254.86699,138.76995 255.12132,139.37135 255.37554,139.97259 255.59176,140.52966 255.72561,141.18422 255.85943,141.83867 255.9069,142.54472 255.9069,143.23882 255.9069,143.93291 255.85937,144.60875 255.72561,145.2632 255.59176,145.9177 255.37554,146.56536 255.12132,147.16672 254.86699,147.76807 254.57609,148.35418 254.21488,148.88895 253.85367,149.42367 253.43085,149.88454 252.97608,150.33925 252.52138,150.79394 252.06051,151.24699 251.52578,151.60826 250.99102,151.96948 250.40484,152.26037 249.80355,152.5147 249.2022,152.76892 248.55454,152.95494 247.90003,153.08878 247.24559,153.22255 246.53948,153.30028 245.84544,153.30028 245.15133,153.30028 244.4755,153.22266 243.82106,153.08878 243.16649,152.95494 242.54905,152.76892 241.94775,152.5147 241.3464,152.26037 240.76029,151.96948 240.22552,151.60826 239.69086,151.24699 239.22993,150.79394 238.77522,150.33925 238.32051,149.88454 237.89763,149.42367 237.53642,148.88895 237.17511,148.35418 236.88431,147.76807 236.62998,147.16672 236.37582,146.56536 236.18976,145.9177 236.0559,145.2632 235.92194,144.60875 235.8444,143.93291 235.8444,143.23882 235.8444,142.54472 235.92204,141.83867 236.0559,141.18422 236.18976,140.52966 236.37582,139.97259 236.62998,139.37135 236.88431,138.76995 237.17511,138.15362 237.53642,137.6189 237.89763,137.08419 238.32051,136.56288 238.77522,136.10817 239.22993,135.65346 239.69086,135.26079 240.22552,134.89959 240.76029,134.53844 241.3464,134.24748 241.94775,133.99315 242.54905,133.73893 243.16649,133.55287 243.82106,133.41907 244.31189,133.31864 244.81767,133.23725 245.33179,133.20757 Z M 244.72241,136.76571 C 243.56517,136.76571 242.71967,137.71986 242.71967,138.87706 L 242.71967,144.62022 246.9939,148.41402 C 247.86047,149.1809 249.1925,149.12044 249.95937,148.25387 L 249.95937,148.22811 C 250.72629,147.36148 250.58666,146.10868 249.72007,145.3418 L 246.83376,142.77762 246.83376,138.87706 C 246.84497,137.71992 245.90719,136.76571 244.75002,136.76571 Z',
            fillColor: 'rgb(66, 183, 91)',
            iconClass: 'value-duration',
//            nSamples: 500,
            nSamples: 50,
            serializable: ['hours', 'minutes', 'seconds', 'milliseconds', 'outputUnits'],
            defaults: {
                duration: moment.duration({milliseconds: 1, seconds: 1, minutes: 1, hours: 1}),
                outputUnits: 'minutes',
                milliseconds: 1,
                seconds: 1,
                minutes: 1,
                hours: 1
            },
            getDisplayableString: function () {
                return this.duration.as(this.outputUnits).toFixed(2) + ' ' + this.outputUnits;
            },
            init: function (parameters) {
                var hours = parameters.hours || 0;
                var minutes = parameters.minutes || 0;
                var seconds = parameters.seconds || 0;
                var milliseconds = parameters.milliseconds || 0;
                var outputUnits = parameters.outputUnits || 'minutes';
                var duration = moment.duration({milliseconds: milliseconds, seconds: seconds, minutes: minutes, hours: hours});
                return new iVoLVER.model.Value({duration: duration, milliseconds: milliseconds, seconds: seconds, minutes: minutes, hours: hours, outputUnits: outputUnits});
            },
            onEditing: {
//                pepito: {type: 'radio', label: 'Test vertical radio buttons', options: durationOutputOptions, vertical: true},
                hours: {type: 'number', style: 'width: 55px;', divStyle: 'float: left;'},
                minutes: {type: 'number', style: 'width: 55px;', divStyle: 'float: left;'},
                seconds: {type: 'number', style: 'width: 55px;', divStyle: 'float: left;'},
                milliseconds: {type: 'number', style: 'width: 55px;', breakAfter: true, divStyle: 'float: left; margin-bottom: 15px;'},
                outputUnits: {type: 'select', label: 'Show as', options: durationOutputOptions, divStyle: 'float: left;', onchange: function (valueHolder) {
                        var outputLabel = valueHolder.getConfigurationField('outputLabel');
                        var selectedDurationUnits = valueHolder.getConfigurationField('outputUnits').val();
                        var newLabel = "( " + valueHolder.value.duration.as(selectedDurationUnits).toFixed(4) + " " + selectedDurationUnits + ' )';
                        outputLabel.text(newLabel);
                    }},
                outputLabel: {type: 'label', label: '', divStyle: 'margin-bottom: 0px;'},
            }
        });
    },
    _registerShapeDataType: function (sectionID) {
        iVoLVER.data.registerType({
            sectionID: sectionID,
            name: 'Shape',
            iconPath: 'M -1719.6288,3002.9961 -1719.6288,3030.7773 -1701.1987,3030.7773 -1698.5659,3025.7773 -1692.413,3014.0273 -1692.413,3002.9961 Z M -1692.413,3014.0273 -1692.413,3030.7773 -1701.1987,3030.7773 -1706.9223,3041.6836 -1690.2094,3041.6836 -1673.4964,3041.6836 -1681.8529,3025.7773 -1690.2094,3009.8398 Z',
            fillColor: 'rgb(255,139,30)',
            iconClass: 'value-shape',
//            nSamples: 500,
            nSamples: 50,
            serializable: ['shape'],
            defaults: {shape: RECTANGULAR_MARK},
            getDisplayableString: function () {
                return this.shape;
            },
            onEditing: {
                shape: {type: 'select', label: 'Select shape', options: markShapes, divStyle: 'float: left; margin-bottom: 15px;', onchange: function (valueHolder) {
                        var selectedShape = valueHolder.getConfigurationField('shapeSelector').val();
                        // console.log("You have chosen: " + selectedShape);
                    }},
            }
        });
    },
    _registerRangeGenerator: function (sectionID) {
        iVoLVER.gui.add.draggableIcon({
            sectionID: sectionID || iVoLVER.gui.getSectionByTitle(iVoLVER.gui.sectionTitles.values),
            iconClass: 'range-generator',
            tooltip: 'Range',
            liStyle: 'margin-right: 10px; margin-bottom: 0px;',
            aStyle: 'padding-top: 6px; padding-left: 10px; padding-bottom: 0px;',
            iStyle: 'font-size: 24px;',
            onMouseUp: function (x, y) {
                var aSlider = new iVoLVER.model.Slider({
                    left: x,
                    top: y,
                    animateBirth: true,
                    compressedProperties: {
                        width: 150
                    },
                    expandedProperties: {
                        width: 500
                    }
                });
                canvas.add(aSlider);
            }
        });

    },
    _registerCoreDataTypes: function (sectionID) {
        iVoLVER._registerNumberDataType(sectionID);
        iVoLVER._registerColorDataType(sectionID);
        iVoLVER._registerStringDataType(sectionID);
        iVoLVER._registerDateAndTimeDataType(sectionID);
        iVoLVER._registerDurationDataType(sectionID);
        iVoLVER._registerShapeDataType(sectionID);
        iVoLVER._registerRangeGenerator(sectionID);
    },
    _registerCoreCollectiveOperators: function () {
//        iVoLVER.data.registerOperator({
//            name: 'Collective Addition',
//            requiredOperation: 'add',
//            iconPath: iVoLVER._operatorsIcons.addition,
//            iconClass: 'operator-additionIcon',
//            acceptSingleVals: true,
//            acceptCollectiveVals: true,
//            outputsCollectiveVal: true
//        });
        iVoLVER.data.registerOperator({
            name: 'Collective Subtraction',
            requiredOperation: 'subtract',
            iconPath: iVoLVER._operatorsIcons.subtraction,
            iconClass: 'operator-subtractionIcon',
//                acceptSingleVals: false,
//                acceptCollectiveVals: true,
            onlyCollectiveInputs: true,
//                acceptCollectiveVals: function (theOperator) {
//                    // some logic to check wheter this operator should accept or not collective values
//                    if (theOperator.inConnections.length > 1) {
//                        return true;
//                    }
//                },
            binary: true, // also taken into account when the operator is compressed, but used as well to check whether it should be expandable
            commutative: false,
            outputsCollectiveVal: true
        });
        iVoLVER.data.registerOperator({
            name: 'Collective Multiplication',
            requiredOperation: 'multiply',
            iconPath: iVoLVER._operatorsIcons.multiplication,
            iconClass: 'operator-multiplicationIcon',
            maxInputs: 2,
            outputsCollectiveVal: true,
            acceptSingleVals: function (theOperator) {
                var inConnections = theOperator.getInConnections();
                for (var i = 0; i < inConnections.length; i++) {
                    var value = inConnections[i].getValue();
                    if (!iVoLVER.util.isArray(value)) {
                        return false;
                    }
                }
                return true;
            },
            acceptCollectiveVals: function (theOperator) {
                var inConnections = theOperator.getInConnections();
                for (var i = 0; i < inConnections.length; i++) {
                    var value = inConnections[i].getValue();
                    if (iVoLVER.util.isArray(value)) {
                        return false;
                    }
                }
                return true;
            },
            computeResult: function (values) {
                if (values.length === 2) {
                    var firstValue = values[0];
                    var scalar = null, array = null;
                    if (iVoLVER.util.isArray(firstValue)) {
                        array = firstValue;
                        scalar = values[1];
                    } else {
                        scalar = firstValue;
                        array = values[1];
                    }
                    var result = [];
                    array.forEach(function (numberValue) {
                        result.push(numberValue.multiply(scalar));
                    });
                    return result;
                }
            }
        });
//        iVoLVER.data.registerOperator({
//            name: 'Collective Division',
//            requiredOperation: 'divide',
//            iconPath: iVoLVER._operatorsIcons.division,
//            iconClass: 'operator-divisonIcon',
//            acceptSingleVals: true,
//            acceptCollectiveVals: function (theOperator) {
//                // some logic to check wheter this operator should accept or not collective values
//                if (theOperator.inConnections.length > 1) {
//                    return true;
//                }
//            },
//            binary: true, // also taken into account when the operator is compressed, but used as well to check whether it should be expandable
//            commutative: false,
//            outputsCollectiveVal: true
//        });

        iVoLVER.data.registerOperator({
            name: 'Concatenation',
            iconPath: iVoLVER._operatorsIcons.concatenation,
            iconClass: 'collectiveOperator-concat',
            acceptSingleVals: false,
            acceptCollectiveVals: true,
            outputsCollectiveVal: true,
            onlyCollectiveInputs: true,
            computeResult: function (collectiveValues) {
                var result = new Array();
                collectiveValues.forEach(function (collectiveValue) {
                    result = result.concat(collectiveValue);
                });
                return result;
            }
        });
//        iVoLVER.data.registerOperator({
//            name: 'Difference',
//            requiredOperation: 'diff',
//            iconPath: iVoLVER._operatorsIcons.difference,
//            iconClass: 'collectiveOperator-difference',
//            acceptSingleVals: true,
//            acceptCollectiveVals: function (theOperator) {
//                // some logic to check wheter this operator should accept or not collective values
//                if (theOperator.inConnections.length > 1) {
//                    return true;
//                }
//            },
//            binary: true, // also taken into account when the operator is compressed, but used as well to check whether it should be expandable
//            commutative: false,
//            outputsCollectiveVal: true,
//            onlyCollectiveInputs: true
//        });
//        iVoLVER.data.registerOperator({
//            name: 'Union',
//            requiredOperation: 'union',
//            iconPath: iVoLVER._operatorsIcons.union,
//            iconClass: 'collectiveOperator-union',
//            acceptSingleVals: true,
//            acceptCollectiveVals: function (theOperator) {
//                // some logic to check wheter this operator should accept or not collective values
//                if (theOperator.inConnections.length > 1) {
//                    return true;
//                }
//            },
//            binary: true, // also taken into account when the operator is compressed, but used as well to check whether it should be expandable
//            outputsCollectiveVal: true,
//            onlyCollectiveInputs: true
//        });
//        iVoLVER.data.registerOperator({
//            name: 'Intersection',
//            requiredOperation: 'intersect',
//            iconPath: iVoLVER._operatorsIcons.intersection,
//            iconClass: 'collectiveOperator-intersection',
//            acceptSingleVals: true,
//            acceptCollectiveVals: function (theOperator) {
//                // some logic to check wheter this operator should accept or not collective values
//                if (theOperator.inConnections.length > 1) {
//                    return true;
//                }
//            },
//            binary: true, // also taken into account when the operator is compressed, but used as well to check whether it should be expandable
//            outputsCollectiveVal: true,
//            onlyCollectiveInputs: true
//        });
    },
    _registerCoreOperators: function () {

        iVoLVER.data.registerOperator({
            name: 'Addition',
            requiredOperation: 'add',
            nSamples: 100,
            iconPath: iVoLVER._operatorsIcons.addition,
            iconClass: 'operator-additionIcon',
            commutative: false,
        });
        iVoLVER.data.registerOperator({
            name: 'Subtraction',
            nSamples: 100,
            requiredOperation: 'subtract',
            iconPath: iVoLVER._operatorsIcons.subtraction,
            iconClass: 'operator-subtractionIcon',
            acceptSingleVals: true,
            tooltip: 'Subtraction Operator',
            acceptCollectiveVals: false,
            binary: true, // also taken into account when the operator is compressed, but used as well to check whether it should be expandable
            commutative: false
        });
        iVoLVER.data.registerOperator({
            name: 'Multiplication',
            requiredOperation: 'multiply',
            iconPath: iVoLVER._operatorsIcons.multiplication,
            iconClass: 'operator-multiplicationIcon',
            acceptSingleVals: true,
            tooltip: 'Multiplication operator'
        });
        iVoLVER.data.registerOperator({
            name: 'Division',
            requiredOperation: 'divide',
            iconPath: iVoLVER._operatorsIcons.division,
            iconClass: 'operator-divisonIcon',
            acceptSingleVals: true,
            tooltip: 'Divide',
            binary: true, // also taken into account when the operator is compressed, but used as well to check whether it should be expandable
            commutative: false
        });
        iVoLVER._registerCoreCollectiveOperators();
    },
    _buildMissingOperationsErrorMessage: function (operationName, dataType, operationsMissing) {

        // console.log("--------------operationsMissing");
        // console.log(operationsMissing);

        var missingOperationsText = '';
        if (operationsMissing.length === 1) {
            missingOperationsText = operationsMissing[0];
        } else if (operationsMissing.length === 2) {
            missingOperationsText = operationsMissing[0] + ' and ' + operationsMissing[1];
        } else {
            var total = operationsMissing.length;
            for (var i = 0; i < total - 1; i++) {
                missingOperationsText += (operationsMissing[i] + ', ');
            }
            missingOperationsText += ('and ' + operationsMissing[total - 1]);
        }
        return '<b>' + operationName + '</b> is not defined for values of type <b>' + dataType + '</b>. They should implement ' + missingOperationsText + '.';
    },
    init: function () {
        fabric.Object.prototype.getParent = function () {
            return this.expandable;
        }
//        fabric.Object.prototype.hasBorders = false;
//        fabric.Object.prototype.hasControls = false;

        $(document).ready(function () {
            $('.tooltip').tooltipster();
            $('.description').tooltipster();


        });
        // global variables
        alertify.set({buttonReverse: true});
        var brushColor = "#000000";
        var brushWidth = 5;
        // create a wrapper around native canvas element (with id="theCanvas")
        var canvas = new fabric.Canvas('theCanvas', {
            backgroundColor: "#ffffff",
            renderOnAddRemove: false,
            uniScaleTransform: true,
            preserveObjectStacking: true,
            fireRightClick: true, // <-- enable firing of right click events
            fireMiddleClick: true, // <-- enable firing of middle click events
            stopContextMenu: true,
        });
        var width = $('#mainContainer').width();
        var height = $(document).height() - $('#theMenu').height() - 5;
        canvas.setWidth(width);
        canvas.setHeight(height);
        canvas.selection = false;
        canvas.connectorsHidden = false;
        canvas.selectionColor = 'rgba(229,238,244,0.5)';
        canvas.selectionDashArray = [7, 7];
        canvas.selectionBorderColor = '#7c7064';
        canvas.selectionLineWidth = 3;
        checkForRetinaDisplay();

        $("#canvasContainer").on('mousewheel', function (ev) {
            hideOpenTooltips();
            ev.preventDefault();
            var e = ev.originalEvent;
            displaywheel(e);
            zoomChanged();
        });
        var canvasContainerElement = document.querySelector("#canvasContainer");

        var manager = new Hammer.Manager(canvasContainerElement);
        manager.add(new Hammer.Tap({event: 'doubletap', taps: 2, threshold: 75, interval: 400, time: 600, posThreshold: 25}));
        manager.add(new Hammer.Press({event: 'press', time: 450}));
        var pan1Finger = new Hammer.Pan({event: 'pan1Finger', pointers: 1});
        manager.add(pan1Finger);
        var pinch = new Hammer.Pinch({event: 'pinch'});
        manager.add(pinch);
        manager.on("doubletap", function (ev) {
            canvasDoubleTap(ev);
        });
        manager.on("press", function (ev) {
            // if (LOG) {
            // console.log(ev);
//            }
            canvasPressEvent(ev);
        });
        // ###################### PANNING WITH 1 FINGER (TO CUT CONNECTORS) ###################### //
        manager.on("pan1Fingerstart", function (ev) {


            if (canvas.activeMode && iVoLVER._customModes[canvas.activeMode]) {
                return;
            }


            if (!canvas.activePanningMode) {
                //if (!canvas.isDrawingMode && !canvas.getActiveObject() && !canvas.getActiveGroup()) {
                if (!canvas.isDrawingMode && !canvas.getActiveObject()) {
                    // gesture initiated at a blank spot of the canvas
                    canvas.pan1Fingerstarted = true;
                    gestureSetEnabled(manager, 'pinch', false);
                }
            } else if (!canvas.selection) {
                /********** PANNING **********/
                canvas.defaultCursor = "-webkit-grabbing";
                canvas.viewportLeft = canvas.viewportTransform[4];
                canvas.viewportTop = canvas.viewportTransform[5];
                gestureSetEnabled(manager, 'pinch', false);
            } else if (!canvas.getActiveObject()) {
                // console.log("Starting selection");
            }
            hideOpenTooltips();
        });
        manager.on("pan1Fingermove", function (ev) {

            if (canvas.activeMode && iVoLVER._customModes[canvas.activeMode]) {
                return;
            }

            if (!canvas.activePanningMode) {
                //if (!canvas.isDrawingMode && !canvas.getActiveObject() && !canvas.getActiveGroup() && canvas.pan1Fingerstarted) {
                if (!canvas.isDrawingMode && !canvas.getActiveObject() && canvas.pan1Fingerstarted) {
                    // if (LOG) {
                    // console.log("MOVING pan1Finger");
                    // console.log(ev);
//                    }
                }
            } else if (!canvas.selection) {
                /********** PANNING **********/
                canvas.defaultCursor = "-webkit-grabbing";
                // This should only happen when the mouse event happens over a zone where NO objects are being touched
                //if (!canvas.isDrawingMode && !canvas.getActiveObject() && !canvas.getActiveGroup) {
                if (!canvas.isDrawingMode && !canvas.getActiveObject()) {
                    var x = -canvas.viewportLeft - ev.deltaX;
                    var y = -canvas.viewportTop - ev.deltaY;
                    canvas.absolutePan(new fabric.Point(x, y));

                    canvasPanned();

                }
            } else if (!canvas.getActiveObject()) {
                /********** SQUARE SELECTING **********/
                // if (LOG) {
                // console.log("Selecting");
//                }
            }
        });
        manager.on("pan1Fingerend", function (ev) {

            if (canvas.activeMode && iVoLVER._customModes[canvas.activeMode]) {
                return;
            }

            if (!canvas.activePanningMode && !canvas.isSamplingLineMode && !canvas.selection) {
                //if (!canvas.isDrawingMode && !canvas.getActiveObject() && !canvas.getActiveGroup() && canvas.pan1Fingerstarted && !canvas.connectorsHidden) {
                if (!canvas.isDrawingMode && !canvas.getActiveObject() && canvas.pan1Fingerstarted && !canvas.connectorsHidden) {
                    // if (LOG) {
                    // console.log("END pan1Finger");
                    // console.log(ev);
//                    }
                    var xPage, yPage;
                    var viewportLeft = canvas.viewportTransform[4];
                    var viewportTop = canvas.viewportTransform[5];
                    var xPage = ev.pointers[0].pageX;
                    var yPage = ev.pointers[0].pageY;
                    var x2 = (xPage - viewportLeft - $('#theCanvas').offset().left) / canvas.getZoom();
                    var y2 = (yPage - viewportTop - $('#theCanvas').offset().top) / canvas.getZoom();
                    var x1 = (xPage - ev.deltaX - viewportLeft - $('#theCanvas').offset().left) / canvas.getZoom();
                    var y1 = (yPage - ev.deltaY - viewportTop - $('#theCanvas').offset().top) / canvas.getZoom();
                    var p1 = new fabric.Point(x1, y1);
                    var p2 = new fabric.Point(x2, y2);
                    var line = {x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y};
                    var crossedConnectors = getConnectorsCrossedByLine(line);
                    // if (LOG) {
                    // console.log(crossedConnectors.length + " connectors crossed!");
//                    }
                    crossedConnectors.forEach(function (object, i) {
                        var connector = object.connector;
                        var splitPoint = object.splitPoint;
                        connector.split(splitPoint, line);
                    });
                    canvas.pan1Fingerstarted = false;
                }
                gestureSetEnabled(manager, 'pinch', true);
            } else if (!canvas.selection) {
                canvas.defaultCursor = "-webkit-grab";
                gestureSetEnabled(manager, 'pinch', true);
            } else if (!canvas.getActiveObject()) {
                // if (LOG) {
                // console.log("Square selection ended");
//                }
            }
        });
        // ###################### PINCHING ###################### //
        manager.on("pinchstart", function (ev) {
            canvas.defaultCursor = "none";
            //if (!canvas.getActiveObject() && !canvas.getActiveGroup()) {
            if (!canvas.getActiveObject()) {
                canvas.zoomBeforePanning = canvas.getZoom();
            }
        });
        manager.on("pinchmove", function (ev) {

            canvas.defaultCursor = "none";
            // if (LOG) {
            // console.log("%cpinchmove", "background: aqua");
            // console.log(ev);
//            }
            //if (!canvas.getActiveObject() && !canvas.getActiveGroup()) {
            if (!canvas.getActiveObject()) {
                var center = new fabric.Point(ev.center.x, ev.center.y);
                canvas.zoomToPoint(center, canvas.zoomBeforePanning * ev.scale);
            }
        });
//




























        canvas.allowTouchScrolling = false;
        var lastCopiedObject = null;
        bindCanvasDefaultEvents(canvas);
        var copiedObject;
        var canvasScale = 1;
        // button Zoom In
        $("#btnZoomIn").click(function () {
            zoomIn();
        });
        // button Zoom Out
        $("#btnZoomOut").click(function () {
            zoomOut();
        });
        // button Reset Zoom
        $("#btnResetZoom").click(function () {
            resetZoom();
        });
        $("#theCanvas").droppable({
            drop: canvasDropFunction
        });



        // When the system starts up, the panning mode is active by default
        applyActiveMenuButtonStyle($("#panningModeButton"));
        activatePanningMode(canvas);




//        if (iVoLVER.LOG) {
        // console.log("%cStarting iVoLVER init method...", "background: red; color: yellow;");
//        }

        iVoLVER._dataTypes = {};
        iVoLVER._operators = new Array();
        iVoLVER._customModes = new Array();
        iVoLVER._objects = new Array();
        iVoLVER._connections = new Array();
        iVoLVER._graph = new graphlib.Graph({directed: true});
        iVoLVER._undoManager = new UndoManager();

        iVoLVER.gui._paletteSections = {};
        // Uncomment for rightpane
        //iVoLVER.gui.addCanvasVariablesSection();
        // iVoLVER.gui.addCodeShiftSection();
        //iVoLVER.gui.addCodeNoteSection();
        iVoLVER.gui.addSignalsSection();
        iVoLVER.gui.addLogicalOperatorsSection();
        iVoLVER.gui.addPlotsSection();
        iVoLVER.gui.addcodeMultiverseSection();

        iVoLVER._pendingConnections = null;
        iVoLVER._connectableElements = null;

        iVoLVER._undoManager.setCallback(function () {
            $("#undoButton").css('color', iVoLVER._undoManager.hasUndo() ? "black" : "lightgray");
            $("#redoButton").css('color', iVoLVER._undoManager.hasRedo() ? "black" : "lightgray");
        });



        // Defining the operator class
        iVoLVER.Operator = iVoLVER.util.createClass(iVoLVER.model.ValueHolder);
        iVoLVER.util.extends(iVoLVER.Operator.prototype, iVoLVER.model.Expandable);



//        if (iVoLVER.LOG) {
        // console.log("%ciVoLVER has been initialized!", "background: green; color: white;");
//    }

//        (function render() {
//            canvas.requestRenderAll();
//            fabric.util.requestAnimFrame(render);
//        })();



        (function () {
            setInterval(function () {
                canvas.requestRenderAll();
            }, 1);
        })();



        iVoLVER.canvas = canvas;

        adjustCanvasDimensions(canvas);

        return canvas;
    }
};





iVoLVER.animation = {
    default: {
        duration: 500,
        easing: fabric.util.ease['easeOutElastic']
    },
    animateObjectProperty: function (object, property, options) {
        if (iVoLVER.util.isUndefined(object) || iVoLVER.util.isUndefined(property) || iVoLVER.util.isUndefined(options.endValue)) {
            return;
        }
        var duration = options.duration || iVoLVER.animation.default.duration;
        var easing = options.easing || iVoLVER.animation.default.easing;
        var startValue = options.startValue || object[property];
        var endValue = options.endValue;
        var onChange = options.onChange;
        var onComplete = options.onComplete;
        fabric.util.animate({
            duration: duration,
            easing: easing,
            startValue: startValue,
            endValue: endValue,
            onChange: function (currentValue) {
                object[property] = currentValue;
                if (onChange) {
                    onChange(object);
                }
            },
            onComplete: function () {
                if (onComplete) {
                    onComplete(object);
                }
            }
        });
    }
}

/************/
/*** UTIL ***/
/************/

iVoLVER.util = {
    createClass: fabric.util.createClass,
    extends: function (child, parent) {
        if (child.prototype) {
            return iVoLVER.util._extend(child.prototype, parent);
        } else {
            return iVoLVER.util._extend(child, parent);
        }
    },
    getCanvasCenter: function () {
        return getActualCanvasCenter();
    },
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomNumber: function (min, max) {
        return Math.random() * (max - min) + min;
    },
    getRandomColor: function () {
        return generateRandomColor();
    },
    _changeNUmericMarkProperty: function (propertyName, theMark, toValue, withAnimation) {
        if (withAnimation) {
            iVoLVER.util._animateProperty(theMark, propertyName, toValue);
        } else {
            iVoLVER.util._setProperty(theMark, propertyName, toValue);
        }
    },
    _animateProperty: function (theMark, propertyName, numericValue, duration, easing) {
        easing = easing || fabric.util.ease['easeOutBack'];
        duration = duration || 500;
        var property = propertyName.toLowerCase();
        var startValue = theMark[property];
        var endValue = numericValue.number;
        var anchorPoint = theMark.getPointByOrigin(theMark.anchorX, theMark.anchorY);
        fabric.util.animate({
            duration: duration,
            easing: easing,
            startValue: 0,
            endValue: 1,
            onChange: function (currentValue) {
                var propertyValue = startValue + currentValue * (endValue - startValue);
                theMark.set(property, propertyValue);
                theMark.setPositionByOrigin(anchorPoint, theMark.anchorX, theMark.anchorY);
                theMark.positionObjects();
            }
        });
    },
    _setProperty: function (theMark, propertyName, numericValue) {
        var property = propertyName.toLowerCase();
        var endValue = numericValue.number;
        var anchorPoint = theMark.getPointByOrigin(theMark.anchorX, theMark.anchorY);
        theMark.set(property, endValue);
        theMark.setPositionByOrigin(anchorPoint, theMark.anchorX, theMark.anchorY);
        theMark.positionObjects();
    },
    buildPolygon: function (radius, sides, x, y) {

        if (iVoLVER.util.isUndefined(x) || iVoLVER.util.isNull(x)) {
            x = 0;
        }
        if (iVoLVER.util.isUndefined(y) || iVoLVER.util.isNull(y)) {
            y = 0;
        }

        var crd = [];

        /* 1 SIDE CASE */
        if (sides === 1)
            return [[x, y]];
        /* > 1 SIDE CASEs */
        for (var i = 0; i < sides; i++) {
            var ptx = (x + (Math.sin(2 * Math.PI * i / sides) * radius));
            var pty = (y - (Math.cos(2 * Math.PI * i / sides) * radius));
            crd.push({x: ptx, y: pty});
        }
        return crd;
    },
//    getPolygon: function (x, y, radius, sides) {
//        var crd = [];
//        /* 1 SIDE CASE */
//        if (sides === 1)
//            return [[x, y]];
//        /* > 1 SIDE CASEs */
//        for (var i = 0; i < sides; i++) {
//            crd.push([(x + (Math.sin(2 * Math.PI * i / sides) * radius)), (y - (Math.cos(2 * Math.PI * i / sides) * radius))]);
//        }
//        return crd;
//    },
    generateID: function () {
        var d = new Date();
        var id = d.getDate() + '_' + (d.getMonth() + 1) + '_' + (1900 + d.getYear()) + '___' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds() + '_' + d.getMilliseconds() + '___' + Math.floor(Math.random() * 1000) + '_' + Math.floor(Math.random() * 1000);
//        // console.log(id);
        return id;
    },
    bringConnectorsToFront: function (object) {
        if (object) {
            object.inConnections.forEach(function (inConnection) {
                bringToFront(inConnection);
            });
            object.outConnections.forEach(function (outConnection) {
                bringToFront(outConnection);
            });
        }
    },
    requestCanvasUpdate: function () {
        if (iVoLVER.util.isUndefined(iVoLVER.requestsForUpdate)) {
            iVoLVER.requestsForUpdate = 0;
        }
        iVoLVER.requestsForUpdate++;
    },
    withdrawCanvasUpdateRequest: function () {
        iVoLVER.requestsForUpdate--;
    },
    correctValueWithLimits: function (value, min, max) {
        var newValue = value;
        if (newValue > max) {
            newValue = max;
        } else if (newValue < min) {
            newValue = min;
        }
        return newValue;
    },
    computeNormalizedValue: function (min, max, factor) {
        return (max - min) * factor + min;
    },
    _extend: function (child, parent) {
        // JScript DontEnum bug is not taken care of
        for (var property in parent) {

            // has the children that property already? Is that property the events array?
            if (property === 'events') {

                // console.log("parent");
                // console.log(parent[property]);

                // console.log("child");
                // console.log(child[property]);

                child[property] = child[property].concat(parent[property]);
            } else {
                child[property] = parent[property];
            }
        }
        return child;
    },
    makeConnectable: function (object) {
        iVoLVER.util.extends(object, iVoLVER.model.Connectable);
        object.initConnectable();
    },
    makeObservable: function (object) {
        iVoLVER.util.extends(object, iVoLVER.event.Observable);
        object.events = new Array();
    },
    isNull: function (variable) {
        return variable === null;
    },
    isValidDate: function (text) {
        var dateAndTime = moment(text, getDateAndTimeFormats(), true);
        return dateAndTime.isValid();
    },
    isNumber: function (variable) {
        return (typeof variable === "number" || variable instanceof Number);
    },
    isArray: function (variable) {
        return $.isArray(variable);
    },
    isString: function (variable) {
        return (typeof variable === "string" || variable instanceof String);
    },
    isFunction: function (variable) {
        return (typeof variable === "function");
    },
    isObject: function (variable) {
        return (typeof variable === "object");
    },
    isUndefined: function (variable) {
        return (typeof variable === "undefined");
    },
    translateToCenterPoint: function (object, point, newOriginX, newOriginY, finalScaleX, finalScaleY, finalAngle) {
        var cx = point.x, cy = point.y, strokeWidth = object.stroke ? object.strokeWidth : 0;
        if (newOriginX === 'left') {
            cx = point.x + (object.width * finalScaleX + strokeWidth * finalScaleX) / 2;
        } else if (newOriginX === 'right') {
            cx = point.x - (object.width * finalScaleX + strokeWidth * finalScaleX) / 2;
        }
        if (newOriginY === 'top') {
            cy = point.y + (object.height * finalScaleY + strokeWidth * finalScaleY) / 2;
        } else if (newOriginY === 'bottom') {
            cy = point.y - (object.height * finalScaleY + strokeWidth * finalScaleY) / 2;
        }
        // Apply the reverse rotation to the point (it's already scaled properly)
        return fabric.util.rotatePoint(new fabric.Point(cx, cy), point, fabric.util.degreesToRadians(finalAngle));
    },
    translateToOriginPoint: function (object, center, originX, originY, finalScaleX, finalScaleY, finalAngle) {
        var x = center.x, y = center.y, strokeWidth = object.stroke ? object.strokeWidth : 0;

        // Get the point coordinates
        if (originX === 'left') {
            x = center.x - (object.width * finalScaleX + strokeWidth * finalScaleX) / 2;
        } else if (originX === 'right') {
            x = center.x + (object.width * finalScaleX + strokeWidth * finalScaleX) / 2;
        }
        if (originY === 'top') {
            y = center.y - (object.height * finalScaleY + strokeWidth * finalScaleY) / 2;
        } else if (originY === 'bottom') {
            y = center.y + (object.height * finalScaleY + strokeWidth * finalScaleY) / 2;
        }

        // Apply the rotation to the point (it's already scaled properly)
        return fabric.util.rotatePoint(new fabric.Point(x, y), center, fabric.util.degreesToRadians(finalAngle));
    },
    getLastElementOfArray: function (array) {
        return array[array.length - 1];
    },
    getBoundingRect: function (object) {
        object.setCoords && object.setCoords();
        var boundingRect = object.getBoundingRect();
        compensateBoundingRect(boundingRect); // TODO: At some point, this should not be needed
        return boundingRect;
    },
    _updateRelativePosition: function (child, parent) {

        // there are no moving constraints, but there is actual movement, so we need to update the
        // location options for the expanded state of this object

        var expandedOptions = parent.getStateProperties(child, true);

        var expandablePoint = null;
        var objectPoint = null;

        if (iVoLVER.util.isUndefined(expandedOptions.originParent)) {
            expandablePoint = parent.getPointByOrigin('center', 'center');
        } else {
            expandablePoint = parent.getPointByOrigin(expandedOptions.originParent.originX, expandedOptions.originParent.originY);
        }

        if (iVoLVER.util.isUndefined(expandedOptions.originChild)) {
            objectPoint = child.getPointByOrigin('center', 'center');
        } else {
            objectPoint = child.getPointByOrigin(expandedOptions.originChild.originX, expandedOptions.originChild.originY);
        }

        // updating the mark's position attributes
        var newX = objectPoint.x - expandablePoint.x;
        var newY = objectPoint.y - expandablePoint.y;

        // updating options to locate this object in the expanded state
        expandedOptions.x = newX;
        expandedOptions.y = newY;

    },
    _applyMovingConstraint: function (object, constraint, forHorizontalMovement, checkForSmaller) {

        // // console.log("checkForSmaller: " + checkForSmaller);
        var referenceObject = constraint.reference.object;
        var distance = constraint.distance;
        var coordinate = null;
        var referencePos = null;
        var objectPos = null;

        /*objectPos = iVoLVER.util.getBoundingRect(object);
         referencePos = iVoLVER.util.getBoundingRect(referenceObject);

         // console.log("objectPos:");
         // console.log(objectPos);

         var objectRect = new fabric.Rect({
         top: objectPos.top,
         left: objectPos.left,
         width: objectPos.width,
         height: objectPos.height,
         fill: 'rgba(255,255,255,0)',
         stroke: 'black',
         strokeWidth: 1,
         });
         var referenceRect = new fabric.Rect({
         top: referencePos.top,
         left: referencePos.left,
         width: referencePos.width,
         height: referencePos.height,
         fill: 'rgba(255,255,255,0)',
         stroke: 'black',
         strokeWidth: 1,
         });

         canvas.add(objectRect);
         canvas.add(referenceRect);

         if (forHorizontalMovement) {
         coordinate = 'x';
         objectPos = objectRect.getPointByOrigin(constraint.origin, 'center');
         referencePos = referenceRect.getPointByOrigin(constraint.reference.origin, 'center');
         } else {
         coordinate = 'y';
         objectPos = objectRect.getPointByOrigin('center', constraint.origin);
         referencePos = referenceRect.getPointByOrigin('center', constraint.reference.origin);
         }*/

        if (forHorizontalMovement) {
            coordinate = 'x';
            objectPos = object.getPointByOrigin(constraint.origin, 'center');
            referencePos = referenceObject.getPointByOrigin(constraint.reference.origin, 'center');
        } else {
            coordinate = 'y';
            objectPos = object.getPointByOrigin('center', constraint.origin);
            referencePos = referenceObject.getPointByOrigin('center', constraint.reference.origin);
        }

        /*drawRectAt(referencePos, 'red');
         drawRectAt(objectPos, 'green');*/

        var diff = objectPos[coordinate] - referencePos[coordinate];

        /*// console.log("objectPos[coordinate]: " + objectPos[coordinate]);
         // console.log("referencePos[coordinate]: " + referencePos[coordinate]);
         // console.log("diff: " + diff);*/

        var shouldLock = false;

        if (checkForSmaller) {
            if (diff <= distance) {
                shouldLock = true;
            }
        } else {
            if (diff >= distance) {
                shouldLock = true;
            }
        }

        if (shouldLock) {
            object.locked = true;

            var x = objectPos.x;
            var y = objectPos.y;

            var xOrigin = 'center';
            var yOrigin = 'center';

            if (forHorizontalMovement) {
                x = referencePos.x + distance;
                xOrigin = constraint.origin;
            } else {
                y = referencePos.y + distance;
                yOrigin = constraint.origin;
            }

            var newCenter = new fabric.Point(x, y);

            // drawRectAt(newCenter);
            object.setPositionByOrigin(newCenter, xOrigin, yOrigin);
            object.unlockAfterMouseUp = true;
        }
    },
};




iVoLVER.obj = {};


iVoLVER.model = {};

iVoLVER.model.Value = function (options) {

    for (var prop in options) {
        this[prop] = options[prop];
    }

    // returns all the operations the value implements.
    // Object with properties named as operations. Each of these properties has several functional objects with data types as keys
    this.getImplementedOperations = function () {
        return iVoLVER.getOperationsForType(this.getDataType());
    };

    // could this value perform this operation?
    this.implements = function (operation) {
        return this.implementsOn(operation);
    };

    // could this value perform the operation on values of the given type?
    this.implementsOn = function (operation, dataType) {
        var implementedOperations = this.getImplementedOperations();
        if (iVoLVER.util.isUndefined(implementedOperations) || iVoLVER.util.isNull(implementedOperations)) {
            return false;
        } else {
            if (iVoLVER.util.isUndefined(dataType) || iVoLVER.util.isNull(dataType)) {
                return !iVoLVER.util.isUndefined(implementedOperations[operation]) && !iVoLVER.util.isNull(implementedOperations[operation]);
            } else {
                if (iVoLVER.util.isUndefined(implementedOperations[operation]) || iVoLVER.util.isNull(implementedOperations[operation])) {
                    return false;
                } else {
                    return !iVoLVER.util.isUndefined(implementedOperations[operation][dataType]) && !iVoLVER.util.isNull(implementedOperations[operation][dataType]);
                }
            }
        }
    };

    // could this value get involved in this operation because some other data types implements it on its type?
    this.couldBeOperandOf = function (operation, whenImplementedBy) {
        var operableOn = this.getSupportedOperations();
        if (iVoLVER.util.isUndefined(operableOn) || iVoLVER.util.isNull(operableOn)) {
            return false;
        } else {
            if (iVoLVER.util.isUndefined(whenImplementedBy) || iVoLVER.util.isNull(whenImplementedBy)) {
                return !iVoLVER.util.isUndefined(operableOn[operation]) && !iVoLVER.util.isNull(operableOn[operation]);
            } else {
                if (iVoLVER.util.isUndefined(operableOn[operation]) || iVoLVER.util.isNull(operableOn[operation])) {
                    return false;
                } else {
                    return !iVoLVER.util.isUndefined(operableOn[operation][whenImplementedBy]) && !iVoLVER.util.isNull(operableOn[operation][whenImplementedBy]);
                }
            }
        }
    };

    this.interpolateTo = function (anotherValue, steps) {

        var thisValue = this;

        if (thisValue.dataTypeProposition !== anotherValue.dataTypeProposition) {
            return null;
        }

        if (thisValue.isNumberValue) {

            return interpolateNumbers(thisValue.number, anotherValue.number, steps);

        } else if (thisValue.isStringValue) {

        } else if (thisValue.isDurationValue) {

        } else if (thisValue.isDateAndTimeValue) {

        } else if (thisValue.isColorValue) {

            return interpolateColors(thisValue.color.toHex(), anotherValue.color.toHex(), steps);

        } else if (thisValue.isShapeValue) {

        }

        return null;

    };



    this.getSupportedOperationsForType = function (type) {
        var theValue = this;
        var result = null;
        var operations = iVoLVER.getOperationsForType(type);
        if (operations) {
            result = {};
            Object.keys(operations).forEach(function (operation) {
                if (!iVoLVER.util.isUndefined(operations[operation][theValue.getDataType()])) {
                    if (iVoLVER.util.isUndefined(result[operation]) || iVoLVER.util.isNull(result[operation])) {
                        result[operation] = [];
                    }
                    result[operation][type] = operations[operation][theValue.getDataType()];
                }
            });
            return result;
        }
    };

    this.getSupportedOperations = function () {
        var theValue = this;
        var result = {};
        Object.keys(iVoLVER._dataTypes).forEach(function (registeredType) {
            var operations = theValue.getSupportedOperationsForType(registeredType);
            if (operations) {
                Object.keys(operations).forEach(function (operation) {
                    if (!result[operation]) {
                        result[operation] = [];
                    }
                    result[operation][registeredType] = operations[operation][registeredType];
                });
            }
        });
        return result;
    };

    // give the value the support it needs to perform an operation on a given type
    this.addOperationSupport = function (operation, onType) {
        var theValue = this;
        var operations = iVoLVER.getOperationsForType(theValue.getDataType());


        if (iVoLVER.util.isUndefined(operations[operation])) {
            // console.log(operation + " not defined for " + theValue.getDataType() + " data type.");
            operations[operation] = {};
        }

        // console.log("$$$$$$$$$$$$$ operations:");
        // console.log(operations);

        if (!iVoLVER.util.isUndefined(operations[operation][theValue.getDataType()])) {

        }


        // recording that we are adding this support to this value (not to its data type)
        if (iVoLVER.util.isUndefined(theValue.supports) || iVoLVER.util.isNull(theValue.supports)) {
            theValue.supports = {};
        }
        if (iVoLVER.util.isUndefined(theValue.supports[operation]) || iVoLVER.util.isNull(theValue.supports[operation])) {
            theValue.supports[operation] = {};
        }
        theValue.supports[operation][onType] = true;


        // console.log("theValue.supports:");
        // console.log(theValue.supports);

        theValue[operation] = function (aValue) {
            var functionCode = iVoLVER.getOperationsForType(onType)[operation][theValue.getDataType()];
            if (iVoLVER.util.isUndefined(functionCode) || iVoLVER.util.isNull(functionCode)) {
                throw "The <b>" + theValue.getDataType() + "</b> data type does not define the <b>" + operation + "</b> operation on <b>" + aValue.getDataType() + "</b> values. A <b>" + theValue.getDataType() + "</b> cannot be <b>" + operation + "ed</b> to a <b>" + aValue.getDataType() + "</b>.";
            } else {
                return aValue[operation](theValue);
            }
        };
    }

    // gives a value instance all the methods it should get from the given data type
    this.addOperationSupportForType = function (type) {
        var theValue = this;
        var operations = iVoLVER.getOperationsForType(type);
        Object.keys(operations).forEach(function (operation) {
            if (!iVoLVER.util.isUndefined(operations[operation][theValue.getDataType()])) {
                // recording that we are adding this support to this value (not to its data type)
                if (iVoLVER.util.isUndefined(theValue.supports) || iVoLVER.util.isNull(theValue.supports)) {
                    theValue.supports = {};
                }
                if (iVoLVER.util.isUndefined(theValue.supports[operation]) || iVoLVER.util.isNull(theValue.supports[operation])) {
                    theValue.supports[operation] = {};
                }
                theValue.supports[operation][type] = true;
            }
            theValue[operation] = function (aValue) {
                var tmpMethodName = operation + '' + aValue.getDataType();
                var functionCode = iVoLVER.getOperationsForType(theValue.getDataType())[operation][aValue.getDataType()];
                if (iVoLVER.util.isUndefined(functionCode) || iVoLVER.util.isNull(functionCode)) {
                    throw "The <b>" + theValue.getDataType() + "</b> data type does not define the <b>" + operation + "</b> operation on <b>" + aValue.getDataType() + "</b> values. A <b>" + theValue.getDataType() + "</b> cannot be <b>" + operation + "ed</b> to a <b>" + aValue.getDataType() + "</b>.";
                } else {
                    theValue[tmpMethodName] = functionCode;
                    return theValue[tmpMethodName](aValue);
                }
            };
        });
    };

    // gives a value instance all the methods it should get from ALL the data types REGISTERED IN THE SYSTEM
    this.addOperationSupportForRegisteredTypes = function () {
        var theValue = this;
        Object.keys(iVoLVER._dataTypes).forEach(function (registeredType) {
            theValue.addOperationSupportForType(registeredType);
        });
    };

    this.equals = function (anotherValue) {

        var thisValue = this;

        // if (LOG)
        // console.log("Comparing:");

        // if (LOG)
        // console.log("thisValue:");
        // if (LOG)
        // console.log(thisValue);

        // if (LOG)
        // console.log("with this other value:");
        // if (LOG)
        // console.log(anotherValue);

        if (thisValue.dataTypeProposition !== anotherValue.dataTypeProposition) {
            // if (LOG)
            // console.log("uno");
            return false;
        }

        if (thisValue.isNumberValue) {

            /*if (anotherValue.units !== thisValue.units) {
             // if (LOG) // console.log("dos");
             return false;
             }*/

            if (anotherValue.inPrefix === thisValue.inPrefix) {
                // if (LOG)
                // console.log("tres");
                return (anotherValue.unscaledValue == thisValue.unscaledValue);
            }

            var convertedNumber = createNumberValue({
                unscaledValue: anotherValue.unscaledValue,
                inPrefix: anotherValue.inPrefix,
                outPrefix: thisValue.inPrefix,
                units: thisValue.units
            });

            // if (LOG)
            // console.log("convertedNumber:");
            // if (LOG)
            // console.log(convertedNumber);

            // if (LOG)
            // console.log("thisValue:");
            // if (LOG)
            // console.log(thisValue);

            // if (LOG)
            // console.log("cuatro");

            return (convertedNumber.number === thisValue.unscaledValue);

        }

        return false;

    };

    this.getValueType = function () {
        if (this.isNumberValue) {
            return NUMERIC;
        } else if (this.isStringValue) {
            return STRING;
        } else if (this.isDurationValue) {
            return DURATION;
        } else if (this.isDateAndTimeValue) {
            return DATEANDTIME;
        } else if (this.isColorValue) {
            return COLOR;
        } else if (this.isShapeValue) {
            return SHAPE;
        } else {
            return null;
        }
    };


    this.toXML = function () {

        var valueNode = createXMLElement("value");
        addAttributeWithValue(valueNode, "type", this.getValueType());

        if (this.isNumberValue) {

            appendElementWithValue(valueNode, "unscaledValue", this.unscaledValue);
            appendElementWithValue(valueNode, "inPrefix", this.inPrefix);
            appendElementWithValue(valueNode, "outPrefix", this.outPrefix);
            appendElementWithValue(valueNode, "units", this.units);

        } else if (this.isStringValue) {

            appendElementWithValue(valueNode, "string", this.string);

        } else if (this.isDurationValue) {

            appendElementWithValue(valueNode, "duration", this.duration.asMilliseconds());
            appendElementWithValue(valueNode, "outputUnits", this.outputUnits);

        } else if (this.isDateAndTimeValue) {

            appendElementWithValue(valueNode, "moment", this.moment.format());

        } else if (this.isColorValue) {

            appendElementWithValue(valueNode, "color", this.color.toRgba());

        } else if (this.isShapeValue) {

            appendElementWithValue(valueNode, "shape", this.shape);

            // if (LOG) {
            // console.log("this: ++++++++++++++++++++++++++++");
            // console.log(this);
//        }



            if (this.shape === PATH_MARK || this.shape === FILLEDPATH_MARK) {
                appendCDATAWithValue(valueNode, "path", this.path);
            } else if (this.shape === SVGPATHGROUP_MARK) {
                appendCDATAWithValue(valueNode, "svgPathGroupMark", this.svgPathGroupMark.SVGString);
            }

//            if (this.svgPathGroupMark) {
//                if (this.shape === PATH_MARK || this.shape === FILLEDPATH_MARK) {
//                    appendCDATAWithValue(valueNode, "path", this.svgPathGroupMark.path);
//                } else {
//                    appendCDATAWithValue(valueNode, "svgPathGroupMark", this.svgPathGroupMark.SVGString);
//                }
//            }

        }

        return valueNode;

    };

    this.getDisplayableString = function (options) {

        if (this.isNumberValue) {
            var valueToShow = this.number % 1 === 0 ? this.number : this.number.toFixed(2);
//         return valueToShow + ' ' + this.outPrefix + this.units;
//         return this.number + ' ' + (this.outPrefix || '') + this.units;

            var decimalPositions = 2;
            if (options && options.showAsInteger) {
                decimalPositions = 0;
            }

//            var theString = this.number.toFixed(decimalPositions) + " " + (this.outPrefix || "") + (this.units || "");

            var tmp = "";
            if (this.outPrefix) {
                tmp = this.outPrefix.substring(0, this.outPrefix.indexOf(' '));
                tmp = tmp.trim();
            }

            var theString = this.number.toFixed(decimalPositions) + " " + tmp + (this.units || "");

            return theString.trim();



        } else if (this.isStringValue) {
            return this.string;
        } else if (this.isDurationValue) {
            return this.duration.as(this.outputUnits).toFixed(2) + ' ' + this.outputUnits;
        } else if (this.isDateAndTimeValue) {
//            return this.moment.format('DD/MMM/YYYY, HH:mm:ss');
            return this.moment.format('HH:mm:ss') + "\n" + this.moment.format('DD/MMM/YYYY');
        } else if (this.isColorValue) {
            return this.color.toRgb();
        } else if (this.isShapeValue) {
            return this.shape;
        }

    };




    this.convertTo = function (newValueType) {

        var convertedValue = null;

        if (this.isDurationValue) {

            if (newValueType === NUMERIC) {

                var units = this.outputUnits;
                var unscaledValue = this.duration.as(units);
                var inPrefix = null;
                var outPrefix = null;
                return createNumberValue({
                    unscaledValue: unscaledValue,
                    inPrefix: inPrefix,
                    outPrefix: outPrefix,
                    units: units
                });

            } else if (newValueType === STRING) {

                return  new iVoLVER.model.Value({isStringValue: true, string: '' + this.duration.as(this.outputUnits).toFixed(2) + ' ' + this.outputUnits});

            }

        } else if (this.isShapeValue) {

            if (newValueType === STRING) {

                return  new iVoLVER.model.Value({isStringValue: true, string: '' + this.shape});

            }

        } else if (this.isStringValue) {

            if (newValueType === NUMERIC) {
                var number = Number(this.string);
                if (!isNaN(number)) {
                    return createNumberValue();
                }
                return null;
            }

        } else if (this.isNumberValue) {

            if (newValueType === STRING) {

                return  new iVoLVER.model.Value({isStringValue: true, string: this.getDisplayableString()});

            }

        } else if (this.isColorValue) {

            if (newValueType === STRING) {

                return  new iVoLVER.model.Value({isStringValue: true, string: '' + this.color.toRgb()});

            }

        } else if (this.isDateAndTimeValue) {

            if (newValueType === STRING) {

                return  new iVoLVER.model.Value({isStringValue: true, string: '' + this.getDisplayableString()});

            }

        }

        return convertedValue;

    };

    this.convert = function (newVisualValueProposition) {

        var convertedValue = null;

        if (this.isDurationValue) {

            if (newVisualValueProposition === 'isNumberValue') {


                // if (LOG)
                // console.log("Going to convert: ");
                // if (LOG)
                // console.log(this);

                var units = this.outputUnits;
                var unscaledValue = this.duration.as(units);
                var inPrefix = null;
                var outPrefix = null;
                return createNumericValue({
                    unscaledValue: unscaledValue,
                    inPrefix: inPrefix,
                    outPrefix: outPrefix,
                    units: units
                });

            } else if (newVisualValueProposition === 'isStringValue') {

                return  new iVoLVER.model.Value({isStringValue: true, string: '' + this.duration.as(this.outputUnits).toFixed(2) + ' ' + this.outputUnits});

            }

        } else if (this.isShapeValue) {

            if (newVisualValueProposition === 'isStringValue') {

                return  new iVoLVER.model.Value({isStringValue: true, string: '' + this.shape});

            }

        } else if (this.isStringValue) {

            if (newVisualValueProposition === 'isNumberValue') {
                var number = Number(this.string);
                if (!isNaN(number)) {
                    return createNumberValue();
                }
                return null;
            }

        } else if (this.isNumberValue) {

            if (newVisualValueProposition === 'isStringValue') {

                return  new iVoLVER.model.Value({isStringValue: true, string: this.getDisplayableString()});

            }

        } else if (this.isColorValue) {

            if (newVisualValueProposition === 'isStringValue') {

                return  new iVoLVER.model.Value({isStringValue: true, string: '' + this.color.toRgb()});

            }

        } else if (this.isDateAndTimeValue) {

            if (newVisualValueProposition === 'isStringValue') {

                return  new iVoLVER.model.Value({isStringValue: true, string: '' + this.getDisplayableString()});

            }

        }

        return convertedValue;

    };

    /*this.subtract = function (theOtherValue, outputPrefix) {

     var thisValue = this;

     if (thisValue.isNumberValue) {

     if (theOtherValue.isNumberValue) { /////////////// Subtracting NUMBERS ///////////////

     return subtractNumbers(thisValue, theOtherValue, outputPrefix);

     } else {
     return null;
     }

     } else if (thisValue.isDateAndTimeValue) {

     if (theOtherValue.isDateAndTimeValue) { /////////////// Subtracting DATES ///////////////

     var outputUnits = outputPrefix || 'milliseconds';

     return computeDateDifference(thisValue.moment, theOtherValue.moment, outputUnits);

     } else {
     return null;
     }

     } else if (thisValue.isColorValue) {

     } else if (thisValue.isDurationValue) {

     } else if (thisValue.isShapeValue) {

     } else if (thisValue.isStringValue) {

     } else {
     return null;
     }

     };*/

    this.clone = function () {
        var clonedValue = null;
        if (this.isColorValue) {
            clonedValue = createColorValue(new fabric.Color(this.color.toRgb()));
        } else if (this.isDateAndTimeValue) {
            clonedValue = createDateAndTimeValue(this.moment);
        } else if (this.isNumberValue) {
            var unscaledValue = this.unscaledValue;
            var inPrefix = this.inPrefix;
            var outPrefix = this.outPrefix;
            var units = this.units;
            clonedValue = createNumberValue({
                unscaledValue: unscaledValue,
                inPrefix: inPrefix,
                outPrefix: outPrefix,
                units: units
            });
        } else if (this.isDurationValue) {
            clonedValue = createDurationValue(this.duration, this.outputUnits);
        } else if (this.isShapeValue) {
            clonedValue = createShapeValue(this.shape, this.svgPathGroupMark);
        } else if (this.isStringValue) {
            clonedValue = createStringValue(this.string);
        }
        if (clonedValue) {
            clonedValue.onChange = this.onChange;
            clonedValue.operations = this.operations;
        }
        return clonedValue;
    };

    this.getTypeProposition = function () {
        if (this.isColorValue) {
            return "isColorValue";
        } else if (this.isDateAndTimeValue) {
            return "isDateAndTimeValue";
        } else if (this.isNumberValue) {
            return "isNumberValue";
        } else if (this.isDurationValue) {
            return "isDurationValue";
        } else if (this.isShapeValue) {
            return "isShapeValue";
        } else if (this.isStringValue) {
            return "isStringValue";
        } else {
            return null;
        }
    };

    this.getIconPathName = function () {
        if (this.isColorValue) {
            return "color";
        } else if (this.isDateAndTimeValue) {
            return "dateAndTime";
        } else if (this.isNumberValue) {
            return "number";
        } else if (this.isDurationValue) {
            return "duration";
        } else if (this.isShapeValue) {
            return "shape";
        } else if (this.isStringValue) {
            return "string";
        } else {
            return null;
        }
    };

    this.getDistanceTo = function (anotherValue) {

        if (this.getTypeProposition() !== anotherValue.getTypeProposition()) {
            return null;
        } else {
            if (this.isColorValue) {
                return computeColorDistance(this, anotherValue);
            } else if (this.isDateAndTimeValue) {
                return computeDateAndTimeDistance(this, anotherValue);
            } else if (this.isNumberValue) {
                return computeNumericDistance(this, anotherValue);
            } else if (this.isDurationValue) {
                return computeDurationDistance(this, anotherValue);
            } else if (this.isShapeValue) {
                return computeShapeDistance(this, anotherValue);
            } else if (this.isStringValue) {
                return computeStringDistance(this, anotherValue);
            } else {
                return null;
            }
        }
    };

    this.getDistancesTo = function (arrayOfValues) {
        var theValue = this;
        var arrayOfDistances = new Array();
        arrayOfValues.forEach(function (value) {
            var distance = theValue.getDistanceTo(value);
            arrayOfDistances.push(distance);
        });
        return arrayOfDistances;
    }
};

/******************/
/*** OBSERVABLE ***/
/******************/

iVoLVER.event = {};

iVoLVER.event.Observable = {
    isObservable: true,
    registerListener: function (event, callback) {
        var theObservable = this;
        if (iVoLVER.util.isUndefined(theObservable.events[event])) {
            theObservable.events[event] = new Array();
        }
        theObservable.events[event].push(callback);
    }
};
iVoLVER.util.extends(iVoLVER.event.Observable, fabric.Observable);

var allEvents = [
    'added',
    'rotating',
    'scaling',
    'moving',
    'modified',
    'doubleTap',
    'mousedown',
    'mouseup',
    'pressed',
    'selected',
    'deselected',
    'valueSet',
    'mouseover',
    'mouseout',
    'drop',
    'dragover',
    'dragenter',
    'dragleave',
    'connectionover',
    'connectionout',
    'mousedblclick'
];

allEvents.forEach(function (event) {
    iVoLVER.event.Observable.on(event, function (options) {
        var theObservable = this;
        if (!iVoLVER.util.isUndefined(theObservable.events) && !iVoLVER.util.isUndefined(theObservable.events[event]) && theObservable.events[event].forEach) {
            theObservable.events[event].forEach(function (callback) {
                callback(options);
            });
        }
    });
});


//iVoLVER.event.Observable.on('selected', function (options) {
//    if (canvas.selectedObject) {
//        canvas.selectedObject.fire('deselected');
//    }
//    var theObservable = this;
//    if (theObservable.stackElements) {
//        theObservable.stackElements();
//    }
//    if (theObservable.applySelectedStyle) {
//        theObservable.applySelectedStyle();
//    }
//    canvas.selectedObject = theObservable;
//});
//iVoLVER.event.Observable.on('deselected', function (options) {
//    var theObservable = this;
//    if (theObservable.applyDeselectedStyle) {
//        theObservable.applyDeselectedStyle();
//    }
//});



/******************/
/*** EXPANDABLE ***/
/******************/

iVoLVER.model.Expandable = {
    getChildren: function () {
        return this.objects;
    },
    isExpandable: true,
    default: {
        options: {
            compressed: {
                x: 0,
                y: 0,
                scaleX: 0,
                scaleY: 0,
                opacity: 0,
                angle: 0,
                origin: {
                    container: {originX: 'center', originY: 'center'},
                    object: {originX: 'center', originY: 'center'},
                }
            },
            expanded: {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                angle: 0,
                origin: {
                    container: {originX: 'center', originY: 'center'},
                    object: {originX: 'center', originY: 'center'},
                }
            }
        }
    },
    registerExpandableEvents: function () {

        var theExpandable = this;
        theExpandable.registerListener('mousedown', function (options) {
            theExpandable._previousLocations.push(theExpandable.getCenterPoint());
        });

        theExpandable.registerListener('rotating', function (options) {
            theExpandable.positionObjects();
            theExpandable.moving = true;
        });

        theExpandable.registerListener('moving', function (options) {
            theExpandable.setCoords();
            theExpandable.positionObjects();
            theExpandable.positionHtmlObjects();
            theExpandable.moving = true;
        });

        theExpandable.registerListener('mouseup', function (options) {
            if (theExpandable.moving) {

                iVoLVER.registerUndoRedo({
                    undo: function () {
                        var previousLocation = theExpandable._previousLocations.pop();
                        if (previousLocation) {
                            theExpandable._nextLocations.push(theExpandable.getCenterPoint());
                            theExpandable.setPositionByOrigin(previousLocation, 'center', 'center');
                            theExpandable.positionObjects();
                        }
                    },
                    redo: function () {
                        var nextLocation = theExpandable._nextLocations.pop();
                        if (nextLocation) {
                            theExpandable._previousLocations.push(theExpandable.getCenterPoint());
                            theExpandable.setPositionByOrigin(nextLocation, 'center', 'center');
                            theExpandable.positionObjects();
                        }
                    }
                });
                theExpandable.moving = false;
            }
        });
        theExpandable.registerListener('doubleTap', function (options) {
            if (theExpandable.compressing) {
                theExpandable.expand(true);
            } else {
                theExpandable.compress(true);
            }
        });
    },
    initExpandable: function (options) {

        var theExpandable = this;
        options || (options = {});

        theExpandable.objects = new Array();
        theExpandable.htmlObjects = new Array();
        theExpandable.positioningFunctions = {};
        theExpandable.expandedOptions = {};
        theExpandable.compressedOptions = {};
        theExpandable.callbacks = {};

        theExpandable.movingConstraints = {};

        theExpandable.compressing = theExpandable.compressed;
        theExpandable.isCompressed = theExpandable.compressed;
        theExpandable.expansionCoefficient = theExpandable.compressed ? 0 : 1;

        theExpandable.duration = options.duration || 500;

        if (iVoLVER.util.isUndefined(theExpandable.events)) {
            theExpandable.events = new Array();
        }

        theExpandable.registerExpandableEvents();

        theExpandable.easingCompress = iVoLVER.util.isUndefined(options.easingCompress) ? fabric.util.ease.easeInBack : options.easingCompress;

        theExpandable._previousLocations = new Array();
        theExpandable._nextLocations = new Array();

        theExpandable.expandableInitialized = true;



        if (iVoLVER.util.isUndefined(theExpandable.id) || iVoLVER.util.isNull(theExpandable.id)) {
            theExpandable.id = options ? options.id : iVoLVER.util.generateID();
        }

        iVoLVER._registerObject(theExpandable);

    },
    applyObjectProperties: function (factor) {
        var theExpandable = this;
        if (theExpandable.compressedProperties && theExpandable.expandedProperties) {
            for (var property in theExpandable.compressedProperties) {
                var compressedValue = theExpandable.compressedProperties[property];
                var expandedValue = theExpandable.expandedProperties[property];
                if (!iVoLVER.util.isNull(expandedValue) && !iVoLVER.util.isUndefined(expandedValue)) {
                    theExpandable[property] = iVoLVER.util.computeNormalizedValue(compressedValue, expandedValue, factor);
                }
            }
        }
    },
    compress: function (options) {

        var theExpandable = this;

        if (theExpandable.preventCompression) {
            return;
        }

        var endValue = 0;
        var startValue = theExpandable.expansionCoefficient;
        var duration = options ? options.duration : theExpandable.expansionCoefficient * theExpandable.duration;

        if (startValue === endValue) {
            return;
        }

        theExpandable.compressing = true;

        if (theExpandable.beforeCompressing) {
            theExpandable.beforeCompressing();
        }
        fabric.util.animate({
            duration: duration,
            easing: options ? options.easing : theExpandable.easingCompress,
            startValue: startValue,
            endValue: endValue,
            onChange: function (currentValue) {
                if (theExpandable.compressing) {
                    theExpandable.expansionCoefficient = currentValue;
                    theExpandable.applyObjectProperties(currentValue);
                    theExpandable.positionObjects();
                    if (theExpandable.onChangeCompressing) {
                        theExpandable.onChangeCompressing(currentValue)
                    }
                }
            },
            onComplete: function () {
                if (theExpandable.compressing) {
                    theExpandable.expansionCoefficient = 0;
                    theExpandable.isCompressed = true;
                    theExpandable.positionObjects();
                    if (theExpandable.afterCompressing) {
                        theExpandable.afterCompressing();
                    }
                }
            }
        });
    },
    reCompress: function (newExpansionCoefficient, options) {
        var theExpandable = this;
        theExpandable.expansionCoefficient = newExpansionCoefficient;
        theExpandable.compress(options);
    },
    reExpand: function (newExpansionCoefficient, options) {
        var theExpandable = this;
        theExpandable.expansionCoefficient = newExpansionCoefficient;
        theExpandable.expand(options);
    },
    getExpansionCoefficient: function () {
        return this.expansionCoefficient;
    },
    expand: function (options) {

        options || (options = {});

        var theExpandable = this;

        if (theExpandable.preventExpansion) {
            return;
        }

        theExpandable.compressing = false;

        var duration = options.duration || (1 - theExpandable.expansionCoefficient) * theExpandable.duration;
        var startValue = theExpandable.expansionCoefficient;
        var endValue = 1;

        if (startValue === endValue) {
            return;
        }
        theExpandable.compressing = false;

        if (theExpandable.beforeExpanding) {
            theExpandable.beforeExpanding();
        }

        fabric.util.animate({
            duration: duration,
            easing: options.easing || theExpandable.easingExpand,
            startValue: startValue,
            endValue: endValue,
            onChange: function (currentValue) {
                if (!theExpandable.compressing) {
                    theExpandable.expansionCoefficient = currentValue;
                    theExpandable.applyObjectProperties(currentValue);
                    theExpandable.positionObjects();
                    if (theExpandable.onChangeExpanding) {
                        theExpandable.onChangeExpanding(currentValue)
                    }
                }
            },
            onComplete: function () {
                if (!theExpandable.compressing) {
                    theExpandable.expansionCoefficient = 1;
                    theExpandable.isCompressed = false;
                    theExpandable.positionObjects();
                    if (theExpandable.afterExpanding) {
                        theExpandable.afterExpanding()
                    }
                }
            }
        });
    },
    _checkExpandableInitialization: function () {
        if (iVoLVER.util.isUndefined(this.expandableInitialized)) {
            this.initExpandable();
        }
    },
    _getDefaultOption: function (optionName, forExpanded) {
        var defaultOptions = forExpanded ? iVoLVER.model.Expandable.default.options.expanded : iVoLVER.model.Expandable.default.options.compressed;
        return defaultOptions[optionName];
    },
    _setNotSpecifiedProperties: function (positionOptions, forExpanded) {
        var isUndefined = iVoLVER.util.isUndefined;
        var isNull = iVoLVER.util.isNull;

        var defaultOptions = forExpanded ? iVoLVER.model.Expandable.default.options.expanded : iVoLVER.model.Expandable.default.options.compressed;
        if (isUndefined(positionOptions.originChild) || isNull(positionOptions.originChild)) {
            positionOptions.originChild = defaultOptions.origin.object;
        }
        if (isUndefined(positionOptions.originParent) || isNull(positionOptions.originParent)) {
            positionOptions.originParent = defaultOptions.origin.container;
        }
        if (isUndefined(positionOptions.scaleX) || isNull(positionOptions.scaleX)) {
            positionOptions.scaleX = defaultOptions.scaleX;
        }
        if (isUndefined(positionOptions.scaleY) || isNull(positionOptions.scaleY)) {
            positionOptions.scaleY = defaultOptions.scaleY;
        }
        if (isUndefined(positionOptions.angle) || isNull(positionOptions.angle)) {
            positionOptions.angle = defaultOptions.angle;
        }
        if (isUndefined(positionOptions.opacity) || isNull(positionOptions.opacity)) {
            positionOptions.opacity = defaultOptions.opacity;
        }
    },
    processLocationOptions: function (locationOptions, useBoundingRect, forExpanded) {

        var theExpandable = this;
        theExpandable.setCoords && theExpandable.setCoords();

        var containerWidth = null;
        var containerHeight = null;
        var containerLeft = null;
        var containerRight = null;
        var containerTop = null;
        var containerBottom = null;

        if (useBoundingRect) {
            var boundingRect = iVoLVER.util.getBoundingRect(theExpandable);
            containerWidth = boundingRect.width;
            containerHeight = boundingRect.height;
            containerTop = boundingRect.top;
            containerBottom = boundingRect.top + boundingRect.height;
            containerLeft = boundingRect.left;
            containerRight = boundingRect.left + boundingRect.width;
        } else {
            containerWidth = theExpandable.getScaledWidth();
            containerHeight = theExpandable.getScaledHeight();
            var leftTop = theExpandable.getPointByOrigin('left', 'top');
            var rightBottom = theExpandable.getPointByOrigin('right', 'bottom');
            containerLeft = leftTop.x;
            containerRight = rightBottom.x;
            containerTop = leftTop.y;
            containerBottom = rightBottom.y;
        }

        var deltaLeft = locationOptions.deltaLeft || 0;
        var deltaRight = locationOptions.deltaRight || 0;
        var deltaTop = locationOptions.deltaTop || 0;
        var deltaBottom = locationOptions.deltaBottom || 0;

        var x = null;
        var y = null;

        var width = containerWidth - deltaLeft + deltaRight;
        var height = containerHeight - deltaTop + deltaBottom;

        x = -(-deltaLeft + containerWidth / 2 - width / 2);
        y = deltaTop - containerHeight / 2 + height / 2;

        locationOptions.scaleX = locationOptions.scaleX || theExpandable._getDefaultOption('scaleX', forExpanded);
        locationOptions.scaleY = locationOptions.scaleY || theExpandable._getDefaultOption('scaleX', forExpanded);

        var newOptions = {
            x: x,
            y: y,
            width: width * locationOptions.scaleX,
            height: height * locationOptions.scaleY,
        };

        for (var property in locationOptions) {
            if (property !== 'scaleX' && property !== 'scaleY' && property !== 'x' && property !== 'y' && property !== 'width' && property !== 'height') {
                newOptions[property] = locationOptions[property];
            }
        }

        return newOptions;
    },
    hasChild: function (object) {
        var idx = this.objects.indexOf(object);
        return (idx !== -1);
    },
    removeChild: function (object) {
        var theExpandable = this;
        fabric.util.removeFromArray(theExpandable.objects, object);
        delete object.expandable;
        delete theExpandable.expandedOptions[object.id];
        delete theExpandable.compressedOptions[object.id];
        delete theExpandable.callbacks[object.id];
        delete theExpandable.movingConstraints[object.id];
    },

    addHtmlChild: function (object, positioningFunction) {
        let theExpandable = this;
        theExpandable.htmlObjects.push(object);
        object.id = object.id || iVoLVER.util.generateID();
        theExpandable.positioningFunctions[object.id] = positioningFunction;
    },

    addChild: function (object, options) {

        options || (options = {});

        var theExpandable = this;
        var movingConstraints = null;

        if (!object.isConnectable && !object.isObservable) {

            var onMovingValue = options.movable;
            var shouldAddEvents = false;

            if (iVoLVER.util.isUndefined(onMovingValue)) {
                // object locked by default when nothing is specified
                object.locked = true;
                object.lockMovementX = true;
                object.lockMovementY = true;
                object.lockedCenter = object.getPointByOrigin(object.originX, object.originY);
            } else {
                if (iVoLVER.util.isObject(onMovingValue)) {
                    // moving constraints were sent
                    object.locked = true;
                    object.lockMovementX = !onMovingValue.x;
                    object.lockMovementY = !onMovingValue.y;
                    movingConstraints = onMovingValue;
                    shouldAddEvents = true;
                } else if (onMovingValue) {
                    // free movement is allowed
                    object.locked = false;
                    object.lockMovementX = false;
                    object.lockMovementY = false;
                    shouldAddEvents = true;
                } else {
                    // they sent false: object locked
                    object.locked = true;
                    object.lockMovementX = true;
                    object.lockMovementY = true;
                    object.lockedCenter = object.getPointByOrigin(object.originX, object.originY);
                }
            }

            if (shouldAddEvents) {
                iVoLVER.util.makeObservable(object);
                object.registerListener('mouseup', function (options) {
                    if (object.unlockAfterMouseUp) {
                        object.locked = false;
                    }
                    if (object.lockAfterMouseUp) {
                        // updating the locking center
                        object.lockedCenter = object.getPointByOrigin(object.originX, object.originY);
                        object.locked = true;
                    }
                });
                object.registerListener('mousedown', function (options) {
                    if (object.locked) {
                        object.lockAfterMouseUp = true;
                        object.unlockAfterMouseUp = false;
                    }
                });
                object.registerListener('moving', function (options) {
                    object.moving = true;
                    // the object is being actually moved
                    var theExpandable = object.expandable;
                    if (theExpandable) {
                        var movingConstraints = theExpandable.movingConstraints[object.id];
                        if (movingConstraints) {
                            for (var constraintDescription in movingConstraints) {
                                var forHorizontalMovement = constraintDescription === 'x';
                                var coordinateConstraints = movingConstraints[constraintDescription];
                                if (coordinateConstraints.min) {
                                    iVoLVER.util._applyMovingConstraint(object, coordinateConstraints.min, forHorizontalMovement, true);
                                }
                                if (coordinateConstraints.max) {
                                    iVoLVER.util._applyMovingConstraint(object, coordinateConstraints.max, forHorizontalMovement, false);
                                }

                                iVoLVER.util._updateRelativePosition(object, theExpandable);

                            }
                        } else {
                            // there are no moving constraints, but there is actual movement, so we need to update the
                            // location options for the expanded state of this object
                            iVoLVER.util._updateRelativePosition(object, theExpandable);
                        }
                    }
                });
            }

        } else {
            if (iVoLVER.util.isObject(options.movable)) {
                movingConstraints = options.movable;
            } else {
                if (!options.movable) {
                    object.locked = true;
                } else {
                    object.locked = false;
                }

            }
        }


        var compressedOptions = options.whenCompressed;
        var expandedOptions = options.whenExpanded;
        var callback = options.onPositioning;


        object.expandable = theExpandable;
        object.id = object.id || iVoLVER.util.generateID();

        var id = object.id;

        theExpandable._checkExpandableInitialization();
        theExpandable.objects.push(object);


        if (iVoLVER.util.isUndefined(compressedOptions) || iVoLVER.util.isNull(compressedOptions) || iVoLVER.util.isUndefined(expandedOptions) || iVoLVER.util.isNull(expandedOptions)) {

            var containerCenter = theExpandable.getCenterPoint();
            var objectCenter = object.getCenterPoint();

            var x = objectCenter.x - containerCenter.x;
            var y = objectCenter.y - containerCenter.y;

            if (iVoLVER.util.isUndefined(x) || isNaN(x)) {
                x = 0;
            }

            if (iVoLVER.util.isUndefined(y) || isNaN(y)) {
                y = 0;
            }

            if (iVoLVER.util.isUndefined(object.anchorX) || iVoLVER.util.isNull(object.anchorX)) {
                object.anchorX = 'center';
            }
            if (iVoLVER.util.isUndefined(object.anchorY) || iVoLVER.util.isNull(object.anchorY)) {
                object.anchorY = 'center';
            }

//            expandedOptions = {
//                x: x,
//                y: y,
//                originChild: {originX: object.anchorX, originY: object.anchorY},
//            };

        }



        if (iVoLVER.util.isUndefined(compressedOptions) || iVoLVER.util.isNull(compressedOptions)) {
            compressedOptions = {
                x: 0,
                y: 0,
                scaleX: 0,
                scaleY: 0,
                opacity: 0,
                originParent: {originX: 'center', originY: 'center'},
                originChild: {originX: 'center', originY: 'center'},
            };
        }

        if (iVoLVER.util.isUndefined(expandedOptions) || iVoLVER.util.isNull(expandedOptions)) {

            var containerCenter = theExpandable.getCenterPoint();
            var objectCenter = object.getCenterPoint();

            var x = objectCenter.x - containerCenter.x;
            var y = objectCenter.y - containerCenter.y;

            expandedOptions = {
                x: x,
                y: y,
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                originParent: {originX: 'center', originY: 'center'},
                originChild: {originX: 'center', originY: 'center'},
            };
        }

        theExpandable._setNotSpecifiedProperties(compressedOptions, false);
        theExpandable._setNotSpecifiedProperties(expandedOptions, true);

        theExpandable.expandedOptions[id] = expandedOptions;
        theExpandable.compressedOptions[id] = compressedOptions;
        theExpandable.callbacks[id] = callback;
        theExpandable.movingConstraints[id] = movingConstraints;

        theExpandable.positionObject(object);

        if (object.isExpandable) {
            object.positionObjects();
        }
        if (object.isConnectable) {
            theExpandable.containsConnectable = true;
        }
    },
    _computeTargetPosition: function (object, targetOptions, useBoundingRect) {

        var theExpandable = this;
        theExpandable.setCoords();

        var originParent = targetOptions.originParent;
        var originChild = targetOptions.originChild;

        var referencePoint = null;

        if (useBoundingRect) {
            var boundingRect = iVoLVER.util.getBoundingRect(theExpandable);
            var tmpRect = new fabric.Rect({
                top: boundingRect.top,
                left: boundingRect.left,
                width: boundingRect.width,
                height: boundingRect.height,
                strokeWidth: 0
            });
            referencePoint = tmpRect.getPointByOrigin(originParent.originX, originParent.originY);
        } else {
            referencePoint = theExpandable.getPointByOrigin(originParent.originX, originParent.originY);
        }

        var deltaX = targetOptions.x;
        var deltaY = targetOptions.y;
        var x = null;
        var y = null;

        // CORRECTING FOR THE STROKE WIDTH
        if (originParent.originX === 'center') {
            x = referencePoint.x + deltaX;
        } else if (originParent.originX === 'left') {
            x = referencePoint.x + deltaX + theExpandable.strokeWidth / 2;
        } else if (originParent.originX === 'right') {
            x = referencePoint.x + deltaX - theExpandable.strokeWidth / 2;
        }

        if (originParent.originY === 'center') {
            y = referencePoint.y + deltaY;
        } else if (originParent.originY === 'top') {
            y = referencePoint.y + deltaY + theExpandable.strokeWidth / 2;
        } else if (originParent.originY === 'bottom') {
            y = referencePoint.y + deltaY - theExpandable.strokeWidth / 2;
        }

        var objectPoint = new fabric.Point(x, y);

        var center = iVoLVER.util.translateToCenterPoint(object, objectPoint, originChild.originX, originChild.originY, targetOptions.scaleX, targetOptions.scaleY, targetOptions.angle);
        var position = iVoLVER.util.translateToOriginPoint(object, center, object.originX, object.originY, targetOptions.scaleX, targetOptions.scaleY, targetOptions.angle);

//        drawRectAt(center, 'blue', true);
//        drawRectAt(position, 'yellow', true);

        return position;

    },

    positionHtmlObject: function (object) {
        this.positioningFunctions[object.id] && this.positioningFunctions[object.id]();
    },

//    positionObject: function (object, compressedOptions, expandedOptions, callback) {
    positionObject: function (object) {


//        // console.log("\t\t\t%cobject.iVoLVERType:" + object.iVoLVERType, "background:grey; color: blue;");
//        // console.log("this:");
//        // console.log(this);

        var theExpandable = this;
        theExpandable.setCoords && theExpandable.setCoords();


        var compressedOptions = theExpandable.compressedOptions[object.id];
        var expandedOptions = theExpandable.expandedOptions[object.id];
        var callback = theExpandable.callbacks[object.id];

        if (iVoLVER.util.isUndefined(compressedOptions.x) && iVoLVER.util.isUndefined(compressedOptions.y)) {
            compressedOptions = theExpandable.processLocationOptions(compressedOptions, true, false);
        }

        if (iVoLVER.util.isUndefined(expandedOptions.x) && iVoLVER.util.isUndefined(expandedOptions.y)) {
            expandedOptions = theExpandable.processLocationOptions(expandedOptions, true, true);
        }

        var initiPosition = theExpandable._computeTargetPosition(object, compressedOptions, true);
        var endPosition = theExpandable._computeTargetPosition(object, expandedOptions, true);

        for (var property in compressedOptions) {

            if (property !== 'originParent' && property !== 'originChild') {

                //// console.log("\t\t\t\t%cproperty:" + property, "background:grey; color: blue;");

                var initValue = null;
                var endValue = null;

                if (property === 'x') {
                    property = 'left';
                    initValue = initiPosition.x;
                    endValue = endPosition.x;
                } else if (property === 'y') {
                    property = 'top';
                    initValue = initiPosition.y;
                    endValue = endPosition.y;
                } else {
                    initValue = compressedOptions[property];
                    endValue = expandedOptions[property];
                }


                /*// console.log("\t\t\t\t\tinitValue: " + initValue);
                 // console.log("\t\t\t\t\tendValue: " + endValue);*/


                if (!isNaN(initValue) && !isNaN(endValue)) {
                    var value = iVoLVER.util.computeNormalizedValue(initValue, endValue, theExpandable.expansionCoefficient);
                    //// console.log("\t\t\t\t\tvalue: " + value);
                    object[property] = value;
                    object.setCoords && object.setCoords();
                    if (object._setWidthHeight) {
                        object._setWidthHeight({
                            top: object.top,
                            left: object.left,
                        });
                    }
                }
            }
        }
        object.setCoords && object.setCoords();
        if (object.locked) {
//            object.lockedCenter = object.getCenterPoint();
            object.lockedCenter = object.getPointByOrigin(object.originX, object.originY);
//            drawRectAt(object.lockedCenter, 'green');
        }
        if (object.updateConnectionsPositions) {
            object.updateConnectionsPositions();
        }
        if (!iVoLVER.util.isUndefined(callback) && !iVoLVER.util.isNull(callback)) {
            callback(object, theExpandable);
        }


        // leaving trace to show transitions
//        var clone = fabric.util.object.clone(object);
//        canvas.add(clone);

    },

    positionHtmlObjects: function () {
        var theExpandable = this;
        if (theExpandable._calcDimensions) {
            theExpandable._calcDimensions();
        }
        if (theExpandable.htmlObjects) {
            theExpandable.htmlObjects.forEach(function (object) {
                theExpandable.positionHtmlObject(object);
            });
        }
    },

    positionObjects: function () {
        //// console.log("\t\t%c EXECUTING positionObjects METHOD.", "background:yellow; color: black;");
        var theExpandable = this;
        if (theExpandable._calcDimensions) {
            theExpandable._calcDimensions();
        }
        if (theExpandable.objects) {
            theExpandable.objects.forEach(function (object) {
                theExpandable.positionObject(object);
                if (object.isExpandable) {
                    object.positionObjects();
                }
            });
        }
    },
    getMovingConstraints: function (object) {
        var theExpandable = this;
        return theExpandable.movingConstraints[object.id];
    },
    setMovingConstraints: function (object, constraints) {
        var theExpandable = this;
        theExpandable.movingConstraints[object.id] = constraints;
    },
    getStateProperties: function (object, forExpanded) {
        var theExpandable = this;
        if (forExpanded) {
            return theExpandable.expandedOptions[object.id];
        } else {
            return theExpandable.compressedOptions[object.id];
        }
    },
    modifyLocationOptions: function (object, locationOptions, forExpanded) {
        var theExpandable = this;
        if (forExpanded) {
            theExpandable.expandedOptions[object.id] = locationOptions;
        } else {
            theExpandable.compressedOptions[object.id] = locationOptions;
        }
    }
};
iVoLVER.util.extends(iVoLVER.model.Expandable, iVoLVER.event.Observable);

/******************/
/*** SUBSCRIBER ***/
/******************/
iVoLVER.event.Subscriber = {
    isSubscriber: true,
    subscribe: function (theSubscribable, eventName, processingFunction) {
        var theSubscriber = this;
        theSubscribable.registerSubscriber(theSubscriber, eventName, processingFunction);
    },
    unsubscribe: function (theSubscribable, eventName) {
        var theSubscriber = this;
        theSubscribable.removeSubscriber(theSubscriber, eventName);
    }
};

/********************/
/*** SUBSCRIBABLE ***/
/********************/
iVoLVER.event.Subscribable = {
    isSubscribable: true,
    initSubscribable: function () {
        var theSubscribable = this;
        theSubscribable._subscribers = {};
        allEvents.forEach(function (eventName) {
            theSubscribable.registerListener(eventName, function (options) {
                var subscriptionTuples = theSubscribable._subscribers[eventName];
                if (subscriptionTuples && subscriptionTuples.length > 0) {
                    subscriptionTuples.forEach(function (subscriptionTuple) {
                        var subscriber = subscriptionTuple.subscriber;
                        var processingFunction = subscriptionTuple.processingFunction;
                        processingFunction(subscriber, theSubscribable, options);
                    });
                }
            });
        });
    },
    registerSubscriber: function (subscriberObject, eventName, processingFunction) {
        var theSubscribable = this;
        if (!theSubscribable._subscribers) {
            theSubscribable.initSubscribable();
        }
        if (!theSubscribable._subscribers[eventName]) {
            theSubscribable._subscribers[eventName] = new Array();
        }
        theSubscribable._subscribers[eventName].push({subscriber: subscriberObject, processingFunction: processingFunction});
    },
    removeSubscriber: function (subscriberObject, eventName) {
        var theSubscribable = this;
        var subscribers = theSubscribable._subscribers[eventName];
        var totalSubscribers = subscribers.length;
        if (subscribers && totalSubscribers > 0) {
            fabric.util.removeFromArray(theSubscribable._subscribers[eventName], subscriberObject);
        }
    },
}
iVoLVER.util.extends(iVoLVER.event.Subscribable, iVoLVER.event.Observable);



/********************/
/*** CONFIGURABLE ***/
/********************/
//iVoLVER.model.Configurable = {
//    isConfigurable: true,
//    configurationFunction: null,
//    initConfigurable: function (configurationFunction) {
//        var theConfigurable = this;
//        if (!theConfigurable.preventInteractiveEditing) {
//            theConfigurable.setConfigurationFunction(configurationFunction);
//            theConfigurable.registerListener('doubleTap', function (options) {
//                if (theConfigurable.configurationFunction) {
//                    theConfigurable.configurationFunction(theConfigurable, true);
//                }
//            });
//        }
//
//    },
//    setConfigurationFunction: function (configurationFunction) {
//        var theConfigurable = this;
//        theConfigurable.configurationFunction = configurationFunction;
//    }
//};
//iVoLVER.util.extends(iVoLVER.model.Configurable, iVoLVER.event.Observable);

/*******************/
/*** CONNECTABLE ***/
/*******************/

iVoLVER.model.Connectable = {
    isConnectable: true,
    getInConnections: function () {
        return this.inConnections;
    },
    getOutConnections: function () {
        return this.outConnections;
    },
    disconnect: function (removeIncomingConnections, removeOutgoingConnections) {
        var theConnectable = this;
        if (removeIncomingConnections) {
            theConnectable.inConnections.forEach(function (inConnection) {
                inConnection.contract(false);
            });
        }
        if (removeOutgoingConnections) {
            theConnectable.outConnections.forEach(function (outConnection) {
                outConnection.contract(true);
            });
        }
    },
    initConnectable: function (options) {

        var theConnectable = this;

        for (var property in options) {
            theConnectable[property] = options[property];
        }

        if (theConnectable.connectableInitialized) {
            return;
        }
        theConnectable.allowInConnections = !iVoLVER.util.isUndefined(options) ? options.allowInConnections : true;
        theConnectable.allowOutConnections = !iVoLVER.util.isUndefined(options) ? options.allowOutConnections : true;

        theConnectable.inConnections = new Array();
        theConnectable.outConnections = new Array();

        theConnectable._previousValues = new Array();
        theConnectable._nextValues = new Array();

        if (iVoLVER.util.isUndefined(theConnectable.events)) {
            theConnectable.events = new Array();
        }

        theConnectable.registerConnectableEvents();

        theConnectable.connectionReleasedOnCanvas = newConnectionReleasedOnCanvas;

        theConnectable.id = iVoLVER.util.generateID();
        iVoLVER._registerObject(theConnectable);

        if (theConnectable.value) {
            if (theConnectable.value && !$.isArray(theConnectable.value)) {
//                var valueType = theConnectable.value.getDataType();
//                if (theConnectable.initConfigurable) {
//                    theConnectable.initConfigurable(iVoLVER._configurationFunctions[valueType]);
//                }
            }
        }
        theConnectable.connectableInitialized = true;
    },
    requestConnection: function (potentialTarget, theConnector) {
        return potentialTarget.processConnectionRequest(theConnector);
    },
    inConnectionRemoved: function (options) {
        var removedConnection = options.connector;
        var destination = removedConnection.target;
        if (!iVoLVER.util.isUndefined(destination)) {
            fabric.util.removeFromArray(destination.inConnections, removedConnection);
        }
    },
    outConnectionRemoved: function (options) {
        var removedConnection = options.connector;
        var source = removedConnection.source;
        fabric.util.removeFromArray(source.outConnections, removedConnection);
    },
    _addOutgoingConnection: function (theConnector) {
        var theConnectable = this;
        theConnectable.outConnections.push(theConnector);
    },
    _addIncomingConnection: function (theConnector) {
        var theConnectable = this;
        theConnectable.inConnections.push(theConnector);
    },
    updateConnectionsPositions: function () {

        var theConnectable = this;

        theConnectable.setCoords && theConnectable.setCoords();
        var connectionPoint = null;

        if (theConnectable.group) {
            connectionPoint = getCenterPointWithinGroup(theConnectable);
        } else {
            if (theConnectable.getCompressedMassPoint) {
                connectionPoint = theConnectable.getCompressedMassPoint();
            } else {
                connectionPoint = theConnectable.getCenterPoint();
            }
        }

        if (theConnectable.inConnections) {
            theConnectable.inConnections.forEach(function (inConnection) {
                if (!inConnection.group) {
                    inConnection.set({'x2': connectionPoint.x, 'y2': connectionPoint.y});
                    inConnection.setCoords && inConnection.setCoords();
                }
            });
        }
        if (theConnectable.outConnections) {
            theConnectable.outConnections.forEach(function (outConnection) {
                if (!outConnection.group) {
                    outConnection.set({'x1': connectionPoint.x, 'y1': connectionPoint.y});
                    outConnection.setCoords && outConnection.setCoords();
                }
            });
        }
    },
    // connectable element's setValue
    setValue: function (value, withAnimation, doNotNotifySubscribers, doNotChangeValue) {

        var theConnectable = this;
        var oldValue = theConnectable.value;

        if (iVoLVER.util.isUndefined(doNotChangeValue)) {
            // we try to change the value
            if (!iVoLVER.util.isUndefined(oldValue) && !iVoLVER.util.isNull(oldValue)) {
                theConnectable.value = oldValue.onChange ? oldValue.onChange(value) : value;
            } else {
                // if not possible, we just use the new value
                theConnectable.value = value;
            }
        } else {

            // they sent the doNotChangeValue parameter

            if (doNotChangeValue) {
                // they are requesting to keep the value as sent
                theConnectable.value = value;
            } else {
                // we try to change the given value
                if (!iVoLVER.util.isUndefined(oldValue) && !iVoLVER.util.isNull(oldValue)) {
                    theConnectable.value = oldValue.onChange ? oldValue.onChange(value) : value;
                } else {
                    // if not possible, we just use the new value
                    theConnectable.value = value;
                }
            }
        }

//        // console.log("theConnectable.value:");
//        // console.log(theConnectable.value);

        theConnectable.outConnections.forEach(function (outConnection) {
            var theValue = theConnectable.value;
            var clonedValue = theValue;
//            if (!iVoLVER.util.isNull() && !iVoLVER.util.isUndefined() && theValue) {
//                clonedValue = theValue;
//            }
            outConnection.setValue(clonedValue, withAnimation);
        });

        if (!doNotNotifySubscribers) {
            theConnectable.fire('valueSet', {withAnimation: withAnimation, previousValue: oldValue});
        }
        iVoLVER._setFieldsValues(theConnectable);

        if (theConnectable.afterValueSet) {
            theConnectable.afterValueSet();
        }


    },
    registerConnectableEvents: function () {

        var theConnectable = this;

        theConnectable.registerListener('pressed', function (options) {

            console.log("pressed event");

            if (theConnectable.locked) {
                // if something that is locked is pressed, then, people might want to unlocked to be moved

                if (theConnectable.locator) {
                    // a locator is needed, otherwise, properties of a mark would be unlocked
                    theConnectable.locked = false;
                    theConnectable.lockAfterMouseUp = true;
                    theConnectable.connecting = false;
                    // the last added connection has to be removed, as it was added in the mouse down event that was fired before the 'pressed' event
                    var lastConnection = theConnectable._getLastConnection();
                    if (lastConnection) {
                        delete iVoLVER._connections[lastConnection.id];
                        lastConnection.remove();
                    }
                    blink(theConnectable.blinkingElement || theConnectable, 0.45);
                }

            } else {

                // when an element is unlocked and is pressed, the user might want to create a connection out of it
                // however, this should be allowed only if the element allows for outgoing connections
                if (theConnectable.allowOutConnections) {
                    // updating the locking center
//                    theConnectable.lockedCenter = theConnectable.getCenterPoint();
                    theConnectable.lockedCenter = theConnectable.getPointByOrigin(theConnectable.originX, theConnectable.originY);
                    theConnectable.locked = true;
                    theConnectable.connecting = true;
                    theConnectable.unlockAfterMouseUp = true;
                    theConnectable.addOutConnection();
                    blink(theConnectable.blinkingElement || theConnectable, 0.45);
                }
            }

        });

        theConnectable.registerListener('mouseup', function (options) {

            if (theConnectable.connecting) {

                var theEvent = options.e;


                if (theEvent) {

                    var theConnector = theConnectable._getLastConnection();

                    if (theConnector) {

                        var canvasCoords = getCanvasCoordinates(theEvent);
                        var coordX = canvasCoords.x;
                        var coordY = canvasCoords.y;
                        var potentialTarget = findPotentialDestination(canvasCoords, ['isConnectable', 'containsConnectable']);

                        if (potentialTarget) {

                            if (potentialTarget.id !== theConnectable.id) {

//                                // console.log("potentialTarget.allowInConnections: " + potentialTarget.allowInConnections);

                                if (!potentialTarget.allowInConnections) {
                                    showErrorMessage('This element does not accept incoming connections.', 1000);
                                    if (potentialTarget.rejectConnection) {
                                        potentialTarget.rejectConnection(theConnector);
                                    } else {
                                        var connector = theConnectable.outConnections.pop();
                                        if (connector) {
                                            delete iVoLVER._connections[connector.id];
                                            connector.contract();
                                        }
                                    }
                                } else {
                                    if (potentialTarget.requestConnection) {

                                        var response = theConnectable.requestConnection(potentialTarget, theConnector);

                                        if (response.connectionAccepted) {

                                            theConnector.target = potentialTarget;
                                            theConnector.setDestination(potentialTarget, true);

                                            iVoLVER._registerConnection(theConnector.source.ID, theConnector.target.ID, theConnector);

                                            potentialTarget._addIncomingConnection(theConnector);
                                            theConnector.target = potentialTarget;


                                            if (potentialTarget.acceptConnection) {
                                                potentialTarget.acceptConnection(theConnector, response.processedValue || theConnector.value);
                                            }

                                            if (theConnector.source.connectionAccepted) {
                                                theConnector.source.connectionAccepted(theConnector, potentialTarget);
                                            }

                                        } else {

                                            showErrorMessage(response.message, 1000);
                                            potentialTarget.rejectConnection(theConnector);

                                        }

                                    } else {

                                        var connector = theConnectable.outConnections.pop();
                                        if (connector) {
                                            delete iVoLVER._connections[connector.id];
                                            connector.contract();
                                        }

                                        showErrorMessage("This element does not accept incoming connections.", 1000);

                                    }
                                }





                            } else {

                                var connector = theConnectable.outConnections.pop();
                                if (connector) {
                                    delete iVoLVER._connections[connector.id];
                                    connector.remove();
                                }

                            }



                        } else {

                            // Mouse up event done over a blank section of the canvas
                            if (theConnectable.destinationCompulsory) {
                                var connector = theConnectable.outConnections.pop();
                                if (connector) {
                                    delete iVoLVER._connections[connector.id];
                                    connector.contract();
                                }
                            } else {
                                theConnectable.connectionReleasedOnCanvas(theConnector, coordX, coordY);
                            }




                        }

                    } else {

//                        // console.log("No connector");

                    }

                }

            } else {
                // // console.log("Removing connector that was left without destination");
                var lastConnection = theConnectable._getLastConnection();
                if (lastConnection && !lastConnection.target) {
                    delete iVoLVER._connections[lastConnection.id];
                    lastConnection.contract();
                }
            }

            theConnectable.connecting = false;

            if (theConnectable.unlockAfterMouseUp) {
                theConnectable.locked = false;
            }
            if (theConnectable.lockAfterMouseUp) {
                // updating the locking center
//                theConnectable.lockedCenter = theConnectable.getCenterPoint();
                theConnectable.lockedCenter = theConnectable.getPointByOrigin(theConnectable.originX, theConnectable.originY);
                theConnectable.locked = true;
            }
//            // console.log("theConnectable.lockAfterMouseUp: " + theConnectable.lockAfterMouseUp);
//            // console.log("theConnectable.unlockAfterMouseUp: " + theConnectable.unlockAfterMouseUp);




        });

        theConnectable.registerListener('mousedown', function (options) {
            if (theConnectable.locked) { // has this connectable object been added to an expandable element?
                //// console.log("XXXXXXXXXXXXXXXXXXXXX");
                theConnectable.connecting = true;
                theConnectable.lockAfterMouseUp = true;
                theConnectable.unlockAfterMouseUp = false;
                if (theConnectable.allowOutConnections) {
                    theConnectable.addOutConnection();
                }
            }
        });

        theConnectable.registerListener('moving', function (options) {

//            // console.log("MOVING CONNECTABLE");

            if (theConnectable.connecting) {

                //// console.log("Connecting");

//                // console.log(options.e);


                theConnectable.fire('selected');

                var e = options.e;
                var target = canvas.findTarget(e);
//                if (target) {
//                    // console.log(target.type);
//                }
                canvas._fireConnectionOutEvents(target, e);



//                var coords = getCanvasCoordinates(options.e);
//                var o = getObjectContaining(coords, true);
//
//                var foundSomethingWorth = o && o !== theConnectable && !o.isConnector;
//
//                //// console.log(foundSomethingWorth);
//
//                if (foundSomethingWorth) {
//
//                    // console.log("ON " + o.type);
//
//                    if (o.__eventListeners['mouseover']) {
//                        //// console.log(o);
//                        o.set('fill', generateRandomColor());
//                        canvas.lastFound = o;
//                    }
//
//                } else if (canvas.lastFound) {
//
//                    //if (canvas.lastFound !== theConnectable && !canvas.lastFound.isConnector) {
//
//                        // console.log("OUT OF " + canvas.lastFound.type);
//
//                        if (canvas.lastFound.__eventListeners['mouseout']) {
//
//                            canvas.lastFound.set('fill', 'red');
//                            canvas.lastFound.fire('mouseout');
//                            canvas.lastFound = null;
//                        }
//                        // // console.log("Heeeere");
////                    canvas.lastFound.fire('mouseout');
////                    canvas.lastFound = null;
//                    //}
//
//
//                }








                if (theConnectable.lockedCenter) {
                    theConnectable.setPositionByOrigin(theConnectable.lockedCenter, theConnectable.originX, theConnectable.originY);
//                    theConnectable.setPositionByOrigin(theConnectable.lockedCenter, 'center', 'center');
                    theConnectable.setCoords && theConnectable.setCoords();
                    if (theConnectable.isExpandable) {
                        theConnectable.positionObjects();
                    }
                }

                var theEvent = options.e;
                if (theEvent) {
                    var canvasCoords = getCanvasCoordinates(theEvent);
                    var connection = theConnectable._getLastConnection();
                    if (connection) {
                        connection.set({x2: canvasCoords.x, y2: canvasCoords.y});
                    }
                }


            } else {

//                // console.log("jhidhñduhasñiugñiu");

                theConnectable.moving = true;

//                var xxx = theConnectable.getCenterPoint();
//                // console.log("the object is being actually moved: " + xxx.x + ' ' + xxx.y);

                // the object is being actually moved

                var theExpandable = theConnectable.expandable;
                if (theExpandable) {
                    var movingConstraints = theExpandable.movingConstraints[theConnectable.id];
                    if (movingConstraints) {
                        for (var constraintDescription in movingConstraints) {
                            var forHorizontalMovement = constraintDescription === 'x';
                            var coordinateConstraints = movingConstraints[constraintDescription];
                            if (coordinateConstraints.min) {
                                iVoLVER.util._applyMovingConstraint(theConnectable, coordinateConstraints.min, forHorizontalMovement, true);
                            }
                            if (coordinateConstraints.max) {
                                iVoLVER.util._applyMovingConstraint(theConnectable, coordinateConstraints.max, forHorizontalMovement, false);
                            }
                        }
                    }
                }

                theConnectable.updateConnectionsPositions();

            }
        });
    },
    _getLastConnection: function () {
        var theConnectable = this;
        return getLastElementOfArray(theConnectable.outConnections);
    },
    _createOutgoingConnection: function (undirected) {
        var theConnectable = this;
        var connectionPoint = null;
        if (theConnectable.getCompressedMassPoint) {
            connectionPoint = theConnectable.getCompressedMassPoint();
        } else {
            connectionPoint = theConnectable.getCenterPoint();
        }
        return new Connector({
            id: iVoLVER.util.generateID(),
            source: theConnectable,
            arrowColor: theConnectable.originalStroke,
            filledArrow: true,
            value: theConnectable.value,
            x2: connectionPoint.x,
            y2: connectionPoint.y,
            undirected: theConnectable.undirectedConnections,
            strokeWidth: iVoLVER.util.isUndefined(theConnectable.connectionOptions) ? 1 : theConnectable.connectionOptions.strokeWidth,
            stroke: iVoLVER.util.isUndefined(theConnectable.connectionOptions) ? null : theConnectable.connectionOptions.stroke
        });
    },
    addOutConnection: function () {
        var theConnectable = this;
        var connection = theConnectable._createOutgoingConnection();
        theConnectable.outConnections.push(connection);
        canvas.add(connection);
    },
    rejectConnection: function (theConnector) {
        theConnector.contract();
    },
};
//iVoLVER.util.extends(iVoLVER.model.Connectable, iVoLVER.event.Observable);

iVoLVER.util.extends(iVoLVER.model.Connectable, iVoLVER.event.Subscribable);
iVoLVER.util.extends(iVoLVER.model.Connectable, iVoLVER.event.Subscriber);




iVoLVER.model.ValueHolder = iVoLVER.util.createClass(fabric.Path, {
    isValueHolder: true,
    reviver: 'iVoLVER.model.ValueHolder',
    showLabel: true,
    serializable: ['showLabel', 'top', 'left', {value: this.value ? this.value.serializable : null}],
    getValue: function () {
        return this.value;
    },
    initConfigurable: function (configurationFunction) {
        var theValueHolder = this;
        if (!theValueHolder.preventInteractiveEditing && (iVoLVER.util.isUndefined(theValueHolder.readOnly) || !theValueHolder.readOnly)) {
            theValueHolder.setConfigurationFunction(configurationFunction);
            theValueHolder.registerListener('doubleTap', function (options) {
                if (theValueHolder.configurationFunction) {
                    theValueHolder.configurationFunction(theValueHolder, true);
                }
            });
        }
    },
    setConfigurationFunction: function (configurationFunction) {
        var theConfigurable = this;
        theConfigurable.configurationFunction = configurationFunction;
    },
    toSVG: function () {

        var theValueHolder = this;
        if (theValueHolder.opacity !== 0 && theValueHolder.scaleX !== 0 && theValueHolder.scaleY !== 0) {
            var theValue = theValueHolder.value;
            var s = '';
            if (theValueHolder.showLabel) {
                if (!iVoLVER.util.isNull(theValue) && !iVoLVER.util.isUndefined(theValue)) {

                    if (!iVoLVER.util.isNull(theValue.getDisplayableString) && !iVoLVER.util.isUndefined(theValue.getDisplayableString)) {

                        var string = theValue.getDisplayableString();

                        if (!iVoLVER.util.isNull(string) && !iVoLVER.util.isUndefined(string)) {
                            var lines = string.split("\n");
                            lines.forEach(function (line, i) {
                                var label = new fabric.Text(line, {
                                    originX: 'center',
                                    originY: 'center',
                                    left: theValueHolder.left + 0,
                                    top: theValueHolder.top + theValueHolder.height / 2 + 20 * (i + 1),
                                    fontSize: 20,
                                    fill: '#000000',
                                    fontFamily: 'Helvetica'
                                });
                                s += label.toSVG();
                            });
                        }

                    }
                }
            }
            var backgroundCircle = '';
            if (!theValueHolder.noBackgroundCircle) {
                var center = theValueHolder.getCenterPoint();
                var c = new fabric.Circle({
                    radius: theValueHolder.width / 2,
                    originX: 'center',
                    originY: 'center',
                    top: center.y,
                    left: center.x,
                    fill: 'white',
                    strokeWidth: 0,
                    stroke: 'transparent'
                });
                backgroundCircle = c.toSVG();
            }
            return backgroundCircle + theValueHolder.callSuper('toSVG') + s;
        } else {
            return '';
        }
    },
    stackElements: function () {
        var theValueHolder = this;
        bringToFront(theValueHolder);
        theValueHolder.inConnections.forEach(function (inConnection) {
            bringToFront(inConnection);
        });
        theValueHolder.outConnections.forEach(function (outConnection) {
            bringToFront(outConnection);
        });
    },
    initialize: function (options) {

        options.iVoLVERType = 'ValueHolder';

        var theValue = options.value;

        if (iVoLVER.util.isUndefined(options.path)) {

            if (iVoLVER.util.isUndefined(theValue)) {
                if (options.isCollective) {
                    if (options.allowedTypes && options.allowedTypes.length === 1 && collectiveValueHolders[options.allowedTypes[0]]) {
                        options.path = collectiveValueHolders[options.allowedTypes[0]].path;
                    } else {
                        options.path = collectiveValueHolders.undefined.path;
                    }
                } else {
                    options.path = valueHoldersConfigs.undefined.path;
                }
            } else {

                if ($.isArray(theValue)) {
                    if (theValue.length > 0) {
                        options.path = theValue[0].getCollectiveValuePath();
                    } else {
                        options.path = collectiveValueHolders.undefined.path;
                    }
                } else {
                    if (options.readOnly) {
                        options.path = theValue.getReadOnlyValuePath();
                    } else {
                        options.path = theValue.getValuePath();
                    }

                }
                options.usingDefaultPath = true;
            }
        } else {
            options.preservePath = true;
        }

        if (iVoLVER.util.isUndefined(options.fill)) {
            if (iVoLVER.util.isUndefined(theValue) || iVoLVER.util.isNull(theValue)) {
                if (options.isCollective) {
                    if (options.allowedTypes && options.allowedTypes.length === 1 && collectiveValueHolders[options.allowedTypes[0]]) {
                        options.fill = collectiveValueHolders[options.allowedTypes[0]].fill;
                    } else {
                        options.fill = collectiveValueHolders.undefined.fill;
                    }
                } else {
                    options.fill = valueHoldersConfigs.undefined.fill;
                }
            } else {
                if ($.isArray(theValue)) {
                    options.fill = theValue[0].getFillColor();
                } else {
                    options.fill = theValue.getFillColor();
                }
            }
        }
        if (iVoLVER.util.isUndefined(options.stroke)) {
            if (iVoLVER.util.isUndefined(theValue) || iVoLVER.util.isNull(theValue)) {
                if (options.isCollective) {
                    if (options.allowedTypes && options.allowedTypes.length === 1 && collectiveValueHolders[options.allowedTypes[0]]) {
                        options.stroke = collectiveValueHolders[options.allowedTypes[0]].stroke;
                    } else {
                        options.stroke = collectiveValueHolders.undefined.stroke;

                    }
                } else {
                    options.stroke = valueHoldersConfigs.undefined.stroke;
                }
            } else {
                if ($.isArray(theValue)) {
                    options.stroke = theValue[0].getStrokeColor();
                } else {
                    options.stroke = theValue.getStrokeColor();

                }
            }
        }

        options.strokeWidth = options.strokeWidth || 2;
        options.originalStroke = options.stroke;

        options.isCollective = !iVoLVER.util.isUndefined(theValue) ? $.isArray(theValue) : options.isCollective;
        if (!iVoLVER.util.isUndefined(theValue) && options.isCollective && iVoLVER.util.isUndefined(options.allowedTypes) && theValue.length > 0) {
            options.allowedTypes = theValue[0].getDataType();
        }

        this.callSuper('initialize', options.path, options);

        if (theValue) {
            theValue.holder = this;
            this.afterRender = theValue.afterRender;
        }

        this.set('originX', 'center');
        this.set('originY', 'center');

        this.set('hasBorders', false);
        this.set('hasControls', false);

        this.initConnectable(options.connectableOptions);

        var theValueHolder = this;

        theValueHolder.registerListener('mouseover', function (options) {

            var text = (theValueHolder.value && theValueHolder.value.getDisplayableString ? theValueHolder.name ? capitalizeFirstLetter(theValueHolder.name) + ': ' + theValueHolder.value.getDisplayableString() : theValueHolder.value.getDisplayableString() : null) || capitalizeFirstLetter(theValueHolder.name) || theValueHolder.tooltipText;

            if (theValueHolder.visible && (theValueHolder.name || theValueHolder.showTooltip)) {

                var mainDiv = $('<div/>', {class: 'icon-large'});
                document.body.appendChild(mainDiv[0]);

                var configurationPanel = $('<div/>');

                configurationPanel.append($('<label/>', {text: text, style: "margin-right: 5px; font-size: 18px;"}));

                mainDiv.tooltipster({
                    content: configurationPanel,
                    animation: 'swing',
                    animationDuration: 250,
                    trigger: 'custom',
                    interactive: false,
                    side: theValueHolder.mouseOverTooltipPosition || ['left', 'right', 'top', 'bottom'],
                    multiple: false,
                    arrow: true,
                    theme: 'tooltipster-punk',
                });

                theValueHolder.propertyTooltip = mainDiv;

                // positioning and showing the configurator
                /*var centerPoint = theValueHolder.getPointByOrigin('center', 'center');
                 var screenCoords = getScreenCoordinates(centerPoint);
                 mainDiv.css('position', 'absolute');
                 mainDiv.css('top', screenCoords.y + 'px');
                 mainDiv.css('left', (screenCoords.x - theValueHolder.getScaledWidth() / 2) + 'px');
                 mainDiv.tooltipster('reposition');*/

                theValueHolder._setTooltipPosition();
                mainDiv.tooltipster('show');

                $('.tooltipster-sidetip.tooltipster-punk .tooltipster-box').css({"border-bottom": "3px solid " + theValueHolder.fill});
            }
        });
        theValueHolder.registerListener('mouseout', function (options) {
            if (theValueHolder.propertyTooltip && theValueHolder.propertyTooltip.tooltipster) {
                theValueHolder.propertyTooltip.tooltipster('close');
            }
        });
        theValueHolder.registerListener('moving', function (options) {
            if (theValueHolder.moving) {
                theValueHolder._setTooltipPosition();
            }
        });

        theValueHolder._setTooltipPosition = function () {
            var mainDiv = theValueHolder.propertyTooltip;
            if (mainDiv) {
                // positioning and showing the configurator
                var centerPoint = theValueHolder.getPointByOrigin('center', 'center');
                var screenCoords = getScreenCoordinates(centerPoint);
                mainDiv.css('position', 'absolute');
                mainDiv.css('top', screenCoords.y + 'px');
                mainDiv.css('left', (screenCoords.x - theValueHolder.getScaledWidth() / 2) + 'px');
                mainDiv.tooltipster('reposition');
            }
        };

        theValueHolder.afterValueSet = function () {
            var theValueHolder = this;
            if (theValueHolder.fill === valueHoldersConfigs.undefined.fill || theValueHolder.shouldUpdateColor) {
                theValueHolder._updateColors();
                theValueHolder.shouldUpdateColor = false;
            }
            if (!iVoLVER.util.isUndefined(theValueHolder.value) && !iVoLVER.util.isNull(theValueHolder.value) && !theValueHolder.isOperator) {
                if (!theValueHolder.preservePath) {
                    theValueHolder._updatePath();
                    if (!iVoLVER.util.isArray(theValueHolder.value)) {
                        var valueType = theValueHolder.value.getDataType();
                        theValueHolder.initConfigurable(iVoLVER._configurationFunctions[valueType]);
                    }
                }
            }
        };

    },
    // the VALUE HOLDER deciding whether or not to accept a new incoming connection
    processConnectionRequest: function (theConnector) {
        var sourceObject = theConnector.source;
        var connectionAccepted = true;
        var message = null;
        var processedValue = null;

        var incommingValue = theConnector.value;

        // value holders can NOT be located. So, connections from locators should be rejected
//        if (sourceObject.isLocator) {
//
//            connectionAccepted = false;
//            message = 'This element cannot be located.';
//
//        } else {
//
//            var incommingValue = theConnector.value;
//            console.log("Value: ")
//            console.log(incommingValue);
//            if (!incommingValue) {
//                connectionAccepted = false;
//                message = 'The source object <b>does not contain</b> a value';
//            } else {
//                var theValueHolder = this;
//                if (theValueHolder.isCollective) {
//
//                    if ($.isArray(incommingValue)) {
//                        if (iVoLVER.util.isUndefined(theValueHolder.allowedTypes)) {
//                            connectionAccepted = true;
//                        } else {
//                            var values = incommingValue;
//                            var firstValue = values[0];
//                            var type2 = firstValue.getDataType();
//                            for (var i = 0; i < theValueHolder.allowedTypes.legth; i++) {
//                                var type1 = theValueHolder.allowedTypes[i];
//                                if (type1 === type2) {
//                                    connectionAccepted = true;
//                                    break;
//                                }
//                            }
//                        }
//                        if (!connectionAccepted) {
//                            message = '<b>Types</b> not compatible';
//                        }
//                    } else {
//                        connectionAccepted = false;
//                        message = 'The incoming value is <b>not a collection</b>.';
//                    }
//
//                } else {
//
//                    if (iVoLVER.util.isUndefined(theValueHolder.value) || iVoLVER.util.isNull(theValueHolder.value)) {
//                        connectionAccepted = true;
//                    } else {
//
////                        // console.log("%c theValueHolder.value", "background: red; color: white;");
////                        // console.log(theValueHolder.value);
//
//                        var type1 = null;
////                        if (iVoLVER.util.isArray(theValueHolder.value)) {
////                            type1 = theValueHolder.value[0].getDataType();
////                        } else {
////                            type1 = theValueHolder.value.getDataType();
////                        }
////
////                        console.log("Type 1");
////                        console.log(type1);
////                        console.log("Value Holder");
////                        console.log(theValueHolder);
////                        console.log("Incoming value");
////                        console.log(incommingValue)
//                        var type2 = null;
////                        if (iVoLVER.util.isArray(incommingValue)) {
////                            type2 = incommingValue[0].getDataType();
////                        } else {
////                            type2 = incommingValue.getDataType();
////                        }
////
////
////                        if (type1 === type2) {
////                            connectionAccepted = true;
////                        } else {
////                            processedValue = incommingValue.convertTo(type1);
////                            connectionAccepted = !iVoLVER.util.isUndefined(processedValue) && !iVoLVER.util.isNull(processedValue);
////                            message = '<b>' + type2 + 's</b> cannot be converted to <b>' + type1 + 's</b>';
////                        }
//
//                        connectionAccepted = true;
//
//                    }
//
//
//
//                }
//            }
//
//
//        }

        connectionAccepted = true;
        return {
            connectionAccepted: connectionAccepted,
            message: "",
            processedValue: incommingValue
        };
    },
    _updateColors: function () {
        var theValueHolder = this;
        var currentResult = theValueHolder.value;
        if (!iVoLVER.util.isNull(currentResult)) {
            var aValue = currentResult;
            if ($.isArray(currentResult)) {
                aValue = currentResult[0];
            }
            if (!iVoLVER.util.isUndefined(aValue) && !iVoLVER.util.isNull(aValue)) {
                theValueHolder.set('fill', aValue.getFillColor());
                theValueHolder.set('stroke', aValue.getStrokeColor());
                theValueHolder.originalStroke = aValue.getStrokeColor();
            }
        }
    },
    _updatePath: function () {
        var theValueHolder = this;
        var theValue = theValueHolder.value;
        var tmpValue = theValue;
        var methodName = '';
        if (iVoLVER.util.isArray(theValue)) {
            if (theValue.length > 0) {
                tmpValue = theValue[0];
            } else {
                tmpValue = null;
                // console.log("Empty array");
            }

            methodName = "getCollectiveValuePath";

        } else {
            methodName = "getValuePath";

        }
//        // console.log("tmpValue:");
//        // console.log(tmpValue);

        if (!iVoLVER.util.isUndefined(tmpValue) && !iVoLVER.util.isNull(tmpValue)) {
//            var tmpPath = new fabric.Path(tmpValue.getValuePath(), {
//            var tmpPath = new fabric.Path(tmpValue.getCollectiveValuePath(), {
            var tmpPath = new fabric.Path(tmpValue[methodName](), {
                top: theValueHolder.top,
                left: theValueHolder.left,
                originX: theValueHolder.originX,
                originY: theValueHolder.originY
            });
            /*// console.log("tmpPath.pathOffset:");
             // console.log(tmpPath.pathOffset);
             // console.log("theValueHolder.pathOffset:");
             // console.log(theValueHolder.pathOffset);*/
            theValueHolder.set('path', tmpPath.path);
            theValueHolder.pathOffset = {
                x: tmpPath.pathOffset.x,
                y: tmpPath.pathOffset.y
            };
        }
    },
    // the VALUE HOLDER accepting a new incoming connection
    acceptConnection: function (theConnector, value) {

        var theValueHolder = this;

        if (theValueHolder.inConnections.length > 1) {
            var connector = theValueHolder.inConnections[0]; // the first connection has to be removed, as there is a new one coming in
            if (connector) {
                connector.contract();
            }
        }

        var newValue = value;
        theValueHolder._previousValues.push(theValueHolder.value);
        theValueHolder.setValue(newValue, true);

        iVoLVER.registerUndoRedo({
            undo: function () {
                iVoLVER.getConnection(theConnector.id).contract();
            },
            redo: function () {
                var restoredConnector = iVoLVER.getConnection(theConnector.id);
                theValueHolder._addOutgoingConnection(restoredConnector);
                canvas.add(restoredConnector);
                restoredConnector.grow(theValueHolder);
            }
        });
    },
    _render: function (ctx) {

        var theValueHolder = this;

        if (!theValueHolder.noBackgroundCircle) {
            ctx.save();
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }

        if (theValueHolder.beforeRender) {
            theValueHolder.beforeRender(ctx);
        }

        theValueHolder.callSuper('_render', ctx);

        if (theValueHolder.value && theValueHolder.showLabel) {
            theValueHolder._drawLabel(ctx);
        }

        if (theValueHolder.afterRender) {
            theValueHolder.afterRender(ctx);
        }

    },
    _drawLabel: function (ctx) {
        var theValueHolder = this;
        if (theValueHolder.value && !$.isArray(theValueHolder.value)) {
            if (theValueHolder.value.getDisplayableString) {
                var string = theValueHolder.value.getDisplayableString();
                if (!iVoLVER.util.isNull(string) && !iVoLVER.util.isUndefined(string)) {
                    var lines = string.split("\n");
                    ctx.save();
                    ctx.font = '16px Helvetica';
                    ctx.fillStyle = 'black';
                    ctx.textAlign = "center";
                    lines.forEach(function (line, i) {
                        if (theValueHolder.drawBackgroundForLabel) {
                            ctx.save();
                            ctx.fillStyle = 'black';
                            ctx.fillStyle = 'rgba(255,255,255,0.9)';
                            var width = ctx.measureText(line).width + 4;
                            var height = 19;
                            ctx.fillRect(-width / 2, 4.5 + theValueHolder.height / 2 + 30 * (i), width, height);
                            ctx.restore();
                        }
                        ctx.beginPath();
                        ctx.fillText(line, 0, theValueHolder.height / 2 + 20 * (i + 1));
                        ctx.closePath();
                    });
                    ctx.restore();
                }
            }
        }
    },
    // this function provides access to the HTML input elements contained in the configuration panel of the given value holder
    getConfigurationField: function (fieldName) {
        var theValueHolder = this;
        var editingParameters = theValueHolder.value.editingParameters;
        if (!iVoLVER.util.isUndefined(editingParameters) && !iVoLVER.util.isNull(editingParameters)) {
            var parameterOptions = editingParameters[fieldName];
            var theID = null;
            if (!iVoLVER.util.isUndefined(parameterOptions) && !iVoLVER.util.isNull(parameterOptions)) {
                theID = generateIDForConfigurationField(theValueHolder, fieldName, parameterOptions.type);
            } else {
                theID = generateIDForConfigurationField(theValueHolder, fieldName);
            }
            return $('#' + theID);
        }
    },
    setEnableConfigurationButton: function (buttonName, enabled) {
        var theValueHolder = this;
        var theButton = theValueHolder.getConfigurationField(buttonName);
        theButton.prop('disabled', !enabled);
        theButton.css('color', enabled ? 'black' : 'grey');
    }
});

iVoLVER.util.extends(iVoLVER.model.ValueHolder.prototype, iVoLVER.model.Connectable); // an iVoLVER Visual Property is also a Connectable element
iVoLVER.util.extends(iVoLVER.model.ValueHolder.prototype, iVoLVER.model.Configurable);



///*****************/
///*** LOCATABLE ***/
///*****************/
//
//iVoLVER.model.Locatable = {
//    isLocatable: true,
//};



/************/
/*** MARK ***/
/************/


iVoLVER.obj.Mark = {
    isMark: true,
    isLocatable: true,
    redirectConnectionsToChildren: true,
    toString: function () {
        return '#<iVoLVER.' + this.iVoLVERType + '>';
    },
    registerMarkEvents: function () {
        var theMark = this;
        theMark.registerListener('added', function (options) {
            if (theMark.stackElements) {
                theMark.stackElements();
            }
        });
    },
    applySelectedStyle: function (options) {
        var theMark = this;
        if (iVoLVER.util.isNull(theMark.originalStroke) || iVoLVER.util.isUndefined(theMark.originalStroke)) {
            if (theMark.stroke !== 'transparent') {
                theMark.originalStroke = theMark.stroke;
            }
        }
        var strokeColor = new fabric.Color(theMark.stroke);
        var r = getR(strokeColor);
        var g = getG(strokeColor);
        var b = getB(strokeColor);
//        theMark.setShadow({
//            color: darkenrgb(r, g, b),
//            blur: 20,
//            offsetX: 0,
//            offsetY: 0
//        });
    },
    applyDeselectedStyle: function () {
        var theMark = this;
        if (!iVoLVER.util.isNull(theMark.originalStroke) && !iVoLVER.util.isUndefined(theMark.originalStroke)) {
            theMark.stroke = theMark.originalStroke;
        }
//        theMark.setShadow("");
    },
    toSVG: function () {
        var theMark = this;
        var s = '';
        var markCenter = theMark.getCenterPoint();
        if (!iVoLVER.util.isUndefined(theMark.label) && theMark.label.string) {
            var string = theMark.label.string;
            if (!iVoLVER.util.isNull(string) && !iVoLVER.util.isUndefined(string)) {
                var lines = string.split("\n");
                lines.forEach(function (line, i) {
                    var label = new fabric.Text(line, {
                        originX: 'center',
                        originY: 'center',
                        left: markCenter.x,
                        top: markCenter.y + theMark.height / 2 + 20 * (i + 1),
                        fontSize: 16,
                        fill: '#000000',
                        fontFamily: 'Helvetica'
                    });
                    s += label.toSVG();
                });
            }
        }

        if (theMark.locator && !theMark.locator.isCompressed) {
            var svgForLocationLines = theMark.getSVGForLocationLines();
            svgForLocationLines.forEach(function (svg) {
                s += svg;
            });
        }

        return theMark.callSuper('toSVG') + s;

    },
    createClass: function (fabricBaseClass, params) {

//        // console.log(params);

        var properties = params.properties;
        var onPropertyChange = params.onPropertyChange;
        var afterInit = params.afterInit;

        var markClass = fabric.util.createClass(fabricBaseClass, {
            isMark: true,
            initialize: function (options) {

//                // console.log("options:");
//                // console.log(options);
//                // console.log("*************");

                var theMark = this;
                options || (options = {});
                options.preventCompression = params.preventCompression;
                options.preventExpansion = params.preventExpansion;
                options.strokeWidth || (options.strokeWidth = 2);
                options.properties = properties;
                options.anchorX = options.anchorX || 'center';
                options.anchorY = options.anchorY || 'center';
                options.lockScalingX = true;
                options.lockScalingY = true;

                // GONZALO: The following three options are important for this new version of the lobrary
                options.hasBorders = false;
                options.hasControls = false;
                options.objectCaching = false; // this allows the marks to continually call their _render method
                // End comment

                theMark.onPropertyChange = onPropertyChange;

//                // console.log("theMark.onPropertyChange: **************");
//                // console.log(theMark.onPropertyChange);

                theMark.properties = properties;
                theMark.callSuper('initialize', options.objects || options.path || options.points || options, options);
                theMark.overrideRenderMethod();
                theMark.borderColor = 'transparent';
                theMark.initializeMark();
                theMark.id = iVoLVER.util.generateID();
                theMark.locationLineCompletionLevel = 0;
                theMark.registerMarkEvents();

                if (options.label) {
                    theMark.visualProperties.label.setValue(createStringValue({string: options.label}));
                }



                if (options.fill && theMark.visualProperties.color) {
                    var fabricColor = new fabric.Color(options.fill);
                    var source = fabricColor.getSource();
                    var r = source[0];
                    var g = source[1];
                    var b = source[2];
                    var a = source[3];
                    theMark.visualProperties.color.setValue(createColorValue({r: r, g: g, b: b, a: a}));
                }

                // overriding the default stackElements function
                theMark.stackElements = function () {
                    var theMark = this;
                    bringToFront(theMark.background);
                    bringToFront(theMark);

                    Object.keys(theMark.visualProperties).forEach(function (property, index) {
                        var visualProperty = theMark.visualProperties[property];
                        bringToFront(visualProperty);
                        visualProperty.inConnections.forEach(function (inConnection) {
                            bringToFront(inConnection);
                        });
                        visualProperty.outConnections.forEach(function (outConnection) {
                            bringToFront(outConnection);
                        });
                    });

                    bringToFront(theMark.anchorPoint);
                    if (theMark.locator && !theMark.locator.isCompressing && theMark.locationProperties) {
                        theMark.locationProperties.forEach(function (locationProperty) {
                            bringToFront(locationProperty);
                        });
                    }
                };

                if (afterInit) {
                    theMark.afterInit = afterInit;
                    theMark.afterInit();
                }

            }
        });
        iVoLVER.util.extends(markClass, iVoLVER.obj.Mark);
        return markClass;
    },
    addAnchorPoint: function () {
        var theMark = this;
        var anchorPoint = new fabric.Circle({
            radius: 8,
            fill: 'rgba(255, 255, 255, 0.25)',
            stroke: 'rgb(61,61,60)',
            originX: 'center',
            originY: 'center',
            strokeWidth: 2,
            mark: theMark,
            hasBorder: false,
            hasControls: false,
            hasRotatingPoint: false,
            borderColor: 'transparent',
            evented: false
        });

        anchorPoint.previousRender = anchorPoint._render;

        anchorPoint._render = function (ctx) {

            var inDistance = 2.5;
            var outDistance = 3.5;

            anchorPoint.previousRender(ctx);
            ctx.beginPath();
            ctx.save();

            ctx.arc(0, 0, 1, 0, 2 * Math.PI);

            // top line
            ctx.moveTo(0, -(anchorPoint.radius - inDistance));
            ctx.lineTo(0, -(anchorPoint.radius + outDistance));

            // right line
            ctx.moveTo(anchorPoint.radius - inDistance, 0);
            ctx.lineTo(anchorPoint.radius + outDistance, 0);

            // left line
            ctx.moveTo(-(anchorPoint.radius - inDistance), 0);
            ctx.lineTo(-(anchorPoint.radius + outDistance), 0);

            // botttom line
            ctx.moveTo(0, anchorPoint.radius - inDistance);
            ctx.lineTo(0, anchorPoint.radius + outDistance);

            ctx.stroke();

            ctx.restore();
            ctx.closePath();

        };








//        var x = 0;
//        var y = 0;
//
//        if (theMark.anchorX === 'center') {
//            x = -0.5; // for some reason, this value is constant regardless of the mark's strokeWidth
//        } else if (theMark.anchorX === 'left') {
//            x = theMark.strokeWidth;
//        } else if (theMark.anchorX === 'right') {
//            x = -theMark.strokeWidth;
//        }
//
//        if (theMark.anchorY === 'center') {
//            y = -0.5; // for some reason, this value is constant regardless of the mark's strokeWidth
//        } else if (theMark.anchorY === 'top') {
//            y = theMark.strokeWidth / 2;
//        } else if (theMark.anchorY === 'bottom') {
//            y = -theMark.strokeWidth;
//        }

//        theMark.addChild(anchorPoint, {
//            x: x,
//            y: y,
//            originParent: {originX: theMark.anchorX, originY: theMark.anchorY},
//        }, {
//            x: x,
//            y: y,
//            originParent: {originX: theMark.anchorX, originY: theMark.anchorY},
//        });

        theMark.addChild(anchorPoint, {
            whenCompressed: {
                x: 0,
                y: 0,
                originParent: {originX: theMark.anchorX, originY: theMark.anchorY},
            },
            whenExpanded: {
                x: 0,
                y: 0,
                originParent: {originX: theMark.anchorX, originY: theMark.anchorY},
            }
        });




        theMark.anchorPoint = anchorPoint;
        canvas.add(anchorPoint);

    },
    initializeMark: function () {

        var theMark = this;

        theMark.initExpandable();

        theMark.initConnectable({
            allowOutConnections: false,
            allowInConnections: true
        });

        var startingSeparation = 30;

        var background = new fabric.Rect({
            originX: 'center',
            originY: 'center',
            rx: 15,
            ry: 15,
            stroke: theMark.stroke,
            strokeWidth: 1,
            selectable: false
        });
        theMark.background = background;



//        // console.log("theMark");
//        // console.log(theMark);


        // VERTICAL BACKGROUND
        theMark.addChild(background, {
            whenCompressed: {
                deltaLeft: -20,
                deltaRight: 20,
                deltaTop: 0,
                deltaBottom: 0,
                scaleX: 1,
            },
            whenExpanded: {
                deltaLeft: -20,
                deltaRight: 20,
                deltaTop: -20,
                deltaBottom: 2 * startingSeparation + (58 * theMark.properties.length),
            },
            onPositioning: function (object, theMark) {

                var otherOptions = {
                    type: 'linear',
                    coords: {x1: 0, y1: 0, x2: 0, y2: object.getScaledHeight()},
                    colorStops: [
                        {offset: 0, color: 'rgb(255, 255, 255)', opacity: 1},
                        {offset: 0.5, color: 'rgb(242,242,242)', opacity: 0.75},
                        {offset: 1, color: 'rgb(255,255,255)', opacity: 1},
                    ]
                };

                object.set('fill', new fabric.Gradient(otherOptions));

                //object.setGradient('fill', {
                //    type: 'linear',
                //    x1: 0,
                //    y1: 0,
                //    x2: 0,
                //    y2: object.getScaledHeight(),
                //    colorStops: {
                //        0: 'rgb(255,255,255, 1)',
                //        0.5: 'rgba(242,242,242,0.75)',
                //        1: 'rgb(255,255,255, 1)'
                //    }
                //});
            }
        });




// HORIZONTAL BACKGROUND
        /*theMark.addChild(background, {
         deltaLeft: -20,
         deltaRight: 20,
         deltaTop: 0,
         deltaBottom: 0,
         scaleX: 1,
         }, {
         deltaLeft: -20,
         deltaRight: 2 * startingSeparation + (58 * theMark.visualProperties.length),
         deltaTop: -20,
         deltaBottom: 20,
         }, function (object, theMark) {
         object.setGradient('fill', {
         type: 'linear',
         x1: 0,
         y1: 0,
         x2: 0,
         y2: object.getScaledHeight(),
         colorStops: {
         0: 'rgb(255,255,255, 1)',
         0.5: 'rgba(242,242,242,0.75)',
         1: 'rgb(255,255,255, 1)'
         }
         });
         });*/

        canvas.add(theMark.background);

        theMark.visualProperties = {};

        theMark.properties.forEach(function (property, index) {

            if (iVoLVER.util.isUndefined(property.name) || iVoLVER.util.isNull(property.name)) {
                throw ("iVoLVER EXCEPTION: A mark is being initialized with a property that has no name associated to it.");
            }

            var visualProperty = new iVoLVER.model.ValueHolder({
                readOnly: property.readOnly,
                value: property.value,
                fill: theMark.fill,
                stroke: theMark.stroke,
                name: property.name,
                path: property.path,
                expandable: theMark,
                showLabel: false
            });

            visualProperty.beforeRender = iVoLVER.obj.Mark.beforeRenderCircularVisualProperty;

            if (property.name === visualPropertiesNames.label) {
                theMark.label = property.value;
            }

            theMark.visualProperties[visualProperty.name] = visualProperty;

            // HORIZONTAL POSITIONING
            /*theMark.addChild(visualProperty, {
             x: 0,
             y: 0,
             originChild: {originX: 'center', originY: 'center'},
             }, {
             x: startingSeparation + (60 * index),
             y: 0,
             originChild: {originX: 'left', originY: 'center'},
             originParent: {originX: 'right', originY: 'center'},
             });*/

            // VERTICAL POSITIONING
            theMark.addChild(visualProperty, {
                whenCompressed: {
                    x: 0,
                    y: 0,
                    originChild: {originX: 'center', originY: 'center'},
                },
                whenExpanded: {
                    x: 0,
                    y: startingSeparation + (60 * index),
                    originChild: {originX: 'center', originY: 'top'},
                    originParent: {originX: 'center', originY: 'bottom'},
                },
                movable: false
            });


            if (!iVoLVER.util.isUndefined(theMark.onPropertyChange) && !iVoLVER.util.isNull(theMark.onPropertyChange)) {
                var f = theMark.onPropertyChange[property.name];
                if (!iVoLVER.util.isUndefined(f) && !iVoLVER.util.isNull(f)) {
                    theMark.subscribe(visualProperty, 'valueSet', function (subscriber, subscribable, eventOptions) {
                        var withAnimation = eventOptions.withAnimation;
                        var functionName = 'set' + property.name + 'Property';
                        theMark[functionName] = f;
                        theMark[functionName](subscribable.value, withAnimation);
                    });
                }
            }

            // adding default support for the string property
            if (property.name === 'label') {
                if (!iVoLVER.util.isUndefined(theMark.onPropertyChange) && !iVoLVER.util.isNull(theMark.onPropertyChange)) {
                    var f = theMark.onPropertyChange.label;
                    if (iVoLVER.util.isUndefined(f) || iVoLVER.util.isNull(f)) {
                        theMark.addDefaultLabelChangeHandler(visualProperty);
                    }
                } else {
                    theMark.addDefaultLabelChangeHandler(visualProperty);
                }
                if (!iVoLVER.util.isUndefined(property.value) && !iVoLVER.util.isNull(property.value)) {
                    theMark.setLabel(property.value);
                }
            } else if (property.name === 'color') { // adding default support for the color property
                if (!iVoLVER.util.isUndefined(theMark.onPropertyChange) && !iVoLVER.util.isNull(theMark.onPropertyChange)) {
                    var f = theMark.onPropertyChange.color;
                    if (iVoLVER.util.isUndefined(f) || iVoLVER.util.isNull(f)) {
                        theMark.addDefaultColorChangeHandler(visualProperty);
                    }
                } else {
                    theMark.addDefaultColorChangeHandler(visualProperty);
                }
                if (!iVoLVER.util.isUndefined(property.value)) {
                    theMark.setMarkColor(property.value);
                }
            }




            canvas.add(visualProperty);

        });


        theMark.addAnchorPoint();
    },
    addDefaultLabelChangeHandler: function (visualProperty) {
        var theMark = this;
        theMark.subscribe(visualProperty, 'valueSet', function (subscriber, subscribable, eventOptions) {
            var withAnimation = eventOptions.withAnimation;
            theMark.setLabelProperty = function (stringValue, withAnimation) {
                theMark.setLabel(stringValue);
            };
            theMark.setLabelProperty(subscribable.value, withAnimation);
        });
    },
    addDefaultColorChangeHandler: function (visualProperty) {
        var theMark = this;
        theMark.subscribe(visualProperty, 'valueSet', function (subscriber, subscribable, eventOptions) {
            var withAnimation = eventOptions.withAnimation;
            theMark.setColorProperty = function (colorValue, withAnimation) {
                if (withAnimation) {
                    theMark.animateToColor(colorValue);
                } else {
                    theMark.setMarkColor(colorValue);
                }
            };
            theMark.setColorProperty(subscribable.value, withAnimation);
        });
    },
    setLabel: function (value) {
        var theMark = this;
        var newValue = value;
        if (!value.isStringValue) {
            newValue = value.convert("isStringValue");
        }
        theMark.label = newValue;
    },
    setProperty: function (propertyName, value, withAnimation) {
        var theMark = this;
        if (propertyName === visualPropertiesNames.color) {
            if (withAnimation) {
                theMark.animateToColor(value);
            } else {
                theMark.changeColor(value);
            }
        } else if (propertyName === visualPropertiesNames.label) {
            theMark.changeLabel(value);
        } else {
            if (withAnimation) {
                theMark.animateProperty(propertyName, value, 500, fabric.util.ease['easeOutBack']);
            } else {
                theMark.changeProperty(propertyName, value);
            }
        }
    },
    animateProperty: function (propertyName, numericValue, duration, easing) {
        var theMark = this;
        easing = easing || fabric.util.ease['easeOutBack'];
        duration = duration || 500;
        var property = propertyName.toLowerCase();
        var startValue = theMark[property];
        var endValue = numericValue.number;
        var anchorPoint = theMark.getPointByOrigin(theMark.anchorX, theMark.anchorY);
        fabric.util.animate({
            duration: duration,
            easing: easing,
            startValue: 0,
            endValue: 1,
            onChange: function (currentValue) {
                var propertyValue = startValue + currentValue * (endValue - startValue);
                theMark.set(property, propertyValue);
                theMark.setPositionByOrigin(anchorPoint, theMark.anchorX, theMark.anchorY);
                theMark.positionObjects();
            }
        });
    },
    changeProperty: function (propertyName, numericValue) {
        var theMark = this;
        var property = propertyName.toLowerCase();
        var endValue = numericValue.number;
        var anchorPoint = theMark.getPointByOrigin(theMark.anchorX, theMark.anchorY);
        theMark.set(property, endValue);
        theMark.setPositionByOrigin(anchorPoint, theMark.anchorX, theMark.anchorY);
        theMark.positionObjects();
    },
    animateToColor: function (colorValue) {
        var theMark = this;
        var source = colorValue.color.getSource();
        var r = source[0];
        var g = source[1];
        var b = source[2];
        var a = source[3];
        var duration = 500;
        var newFill = rgba(r, g, b, a);
        var oldFill = theMark.fill;

        // console.log("oldFill %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        // console.log(oldFill);

        // console.log("newFill %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        // console.log(newFill);

        fabric.util.animateColor(oldFill, newFill, duration, {
            onChange: function (currentColor) {
                // console.log("currentColor: 8888888888888888");
                // console.log(currentColor);
                theMark.setMarkColor(currentColor);
            }
        });
    },
    setMarkColor: function (colorValue) {

        var theMark = this;
        var tmpFabricColor = null;

        // console.log(typeof colorValue);

        // console.log(colorValue);
        const reducer = (accumulator, currentValue) => accumulator + currentValue + ", ";
        // console.log("colorValue: " + colorValue);

        if (iVoLVER.util.isArray(colorValue)) {
            colorValue = colorValue.reduce(reducer, "");
            colorValue = colorValue.substring(0, colorValue.length - 2);
        }

        // console.log("colorValue AFTER:");
        // console.log(colorValue);

        if (iVoLVER.util.isString(colorValue)) {
            if (!colorValue.startsWith("rgba(")) {
                colorValue = "rgba(" + colorValue + ")";
            }
            tmpFabricColor = new fabric.Color(colorValue);
        } else if (colorValue.isColorValue) {
            tmpFabricColor = colorValue.color;
        }

        var source = tmpFabricColor.getSource();

        var r = source[0];
        var g = source[1];
        var b = source[2];
        var a = source[3];

        var fill = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
        var stroke = darkenrgb(r, g, b);

        theMark.set('fill', fill);
        theMark.set('stroke', stroke);
        theMark.originalStroke = stroke;
        theMark.background.set('stroke', stroke);

        Object.keys(theMark.visualProperties).forEach(function (property) {
            var visualProperty = theMark.visualProperties[property];
            visualProperty.originalStroke = stroke;
            visualProperty.set('stroke', stroke);
            visualProperty.set('fill', fill);
            if (!iVoLVER.util.isUndefined(visualProperty.outConnections) && !iVoLVER.util.isNull(visualProperty.outConnections)) {
                visualProperty.outConnections.forEach(function (outConnector) {
                    outConnector.setConnectorColor(stroke);
                });
            }
        });
    },
    overrideRenderMethod: function () {
        var theMark = this;
        var methodName = '_render';
        if (theMark.iVoLVERType === 'PathGroupMark') {
            methodName = 'render';
        }
        theMark[methodName] = function (ctx) {

//            // console.log("me dibujo");

            var theMark = this;
            theMark.callSuper(methodName, ctx);
            if (theMark.locator) {
//                // console.log(theMark.locator);
//                // console.log("Tengo locator");
                theMark._renderLocationLines(ctx);
            }
            if (!iVoLVER.util.isUndefined(theMark.label) && theMark.label.string) {
                ctx.save();
                ctx.font = '16px Helvetica';
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.textAlign = "center";
                ctx.beginPath();
                var boundingRect = iVoLVER.util.getBoundingRect(theMark);
                ctx.rotate(fabric.util.degreesToRadians(-theMark.angle));
                if (theMark.locator) {
                    var width = ctx.measureText(theMark.label.string).width + 4;
                    var height = 19;

                    if (theMark.iVoLVERType === 'PathGroupMark') {
                        var markCenter = theMark.getCenterPoint();
                        ctx.fillRect(markCenter.x - width / 2, markCenter.y + boundingRect.height / 2 + 11, width, height);
                    } else {
                        ctx.fillRect(-width / 2, boundingRect.height / 2 + 11, width, height);
                    }

                }
                ctx.fillStyle = 'black';

                if (theMark.iVoLVERType === 'PathGroupMark') {
                    var markCenter = theMark.getCenterPoint();
                    ctx.fillText(theMark.label.string, markCenter.x, markCenter.y + boundingRect.height / 2 + 25);
                } else {
                    ctx.fillText(theMark.label.string, 0, boundingRect.height / 2 + 20);
                }

                ctx.closePath();
                ctx.restore();
            }

        }
    },
    // CONNECTABLE FUNCTIONS OF THE MARK
    processConnectionRequest: function (theConnector) {
        var sourceObject = theConnector.source;
        return {
            connectionAccepted: sourceObject.isLocator || sourceObject.isValueHolder
        };
    },
    acceptConnection: function (theConnector, value) {

        var theMark = this;
        var theSource = theConnector.source;

        if (theSource.isLocator) {

            if (theMark.inConnections.length > 1) {
                var connector = theMark.inConnections.pop();
                if (connector) {
                    connector.contract();
                }
            }

        } else if (theSource.isValueHolder) {

            // console.log("Someone is requesting a visual property after dropping a connection on top of the mark");

        }
    },
//    rejectConnection: function (theConnector) {
//        theConnector.contract();
//    },
    getCompressedMassPoint: function () {
        var theMark = this;
        return theMark.getPointByOrigin(theMark.anchorX, theMark.anchorY);
    }
};
iVoLVER.util.extends(iVoLVER.obj.Mark, iVoLVER.model.Expandable); // an iVoLVER mark is also a Expandable
//iVoLVER.util.extends(iVoLVER.obj.Mark, iVoLVER.model.Locatable); // an iVoLVER mark is also a Locatable
iVoLVER.util.extends(iVoLVER.obj.Mark, iVoLVER.model.Connectable); // an iVoLVER mark is also a Connectable


/*****************/
/* LOCATOR CLASS */
/*****************/

iVoLVER.obj.Locator = {
    isLocator: true,
    isLocatable: true,
    toSVG: function () {
        var theLocator = this;
        var square = new fabric.Rect({
            width: 7,
            height: 7,
            stroke: 'black',
            fill: 'black',
            originX: 'center',
            originY: 'center',
            strokeWidth: 0,
            top: theLocator.top,
            left: theLocator.left,
            objectCaching: false
        });
        return this.callSuper('toSVG') + square.toSVG();
    },
    getMarksBoundLimits: function () {

        var theLocator = this;

        var leftmost = null;
        var rightmost = null;
        var topmost = null;
        var bottommost = null;

        theLocator.objects.forEach(function (object, index) {
            if (object.isLocatable) {
                var markBoundingRect = iVoLVER.util.getBoundingRect(object);
                var left = markBoundingRect.left;
                var right = markBoundingRect.left + markBoundingRect.width;
                var top = markBoundingRect.top;
                var bottom = markBoundingRect.top + markBoundingRect.height;
                if (iVoLVER.util.isNull(leftmost)) {
                    leftmost = left;
                } else {
                    if (left < leftmost) {
                        leftmost = left;
                    }
                }
                if (iVoLVER.util.isNull(rightmost)) {
                    rightmost = right;
                } else {
                    if (right > rightmost) {
                        rightmost = right;
                    }
                }
                if (iVoLVER.util.isNull(topmost)) {
                    topmost = top;
                } else {
                    if (top < topmost) {
                        topmost = top;
                    }
                }
                if (iVoLVER.util.isNull(bottommost)) {
                    bottommost = bottom;
                } else {
                    if (bottom > bottommost) {
                        bottommost = bottom;
                    }
                }
            }
        });
//        canvas.add(new fabric.Line([leftmost, topmost, leftmost, bottommost], {
//         stroke: 'blue'
//         }));
//         canvas.add(new fabric.Line([rightmost, topmost, rightmost, bottommost], {
//         stroke: 'purple'
//         }));
//         canvas.add(new fabric.Line([leftmost, topmost, rightmost, topmost], {
//         stroke: 'red'
//         }));
//         canvas.add(new fabric.Line([leftmost, bottommost, rightmost, bottommost], {
//         stroke: 'green'
//         }));
        var locatorCenter = theLocator.getCenterPoint();

//        // console.log("leftmost-locatorCenter.x: " + (leftmost-locatorCenter.x));
//        // console.log("locatorCenter.x - leftmost: " + (locatorCenter.x - leftmost));

        return {
            leftmost: leftmost - locatorCenter.x,
            rightmost: locatorCenter.x - rightmost,
            topmost: topmost - locatorCenter.y,
            bottommost: locatorCenter.y - bottommost
        };
    },
    _render: function (ctx) {
        var theLocator = this;
        theLocator.callSuper('_render', ctx);
        if (theLocator.locator) {
            theLocator._renderLocationLines(ctx);
        }
    },
    createClass: function (fabricBaseClass) {
        var locatorClass = fabric.util.createClass(fabricBaseClass, {
            isLocator: true,
            initialize: function (options) {
                var theLocator = this;
                options || (options = {});
                options.fill = options.fill || rgb(174, 174, 172);
                options.stroke = options.stroke || 'transparent';
                options.strokeWidth = options.strokeWidth || 0;
                options.objectCaching = false;
                theLocator.callSuper('initialize', options.path || options.points || options, options);
                theLocator.hasBorder = false;
                theLocator.hasControls = false;
                theLocator.hasRotatingPoint = false;
                theLocator.borderColor = 'transparent';
                theLocator.id = iVoLVER.util.generateID();
                theLocator.initializeLocator();
                theLocator.originX = 'center';
                theLocator.originY = 'center';
                theLocator.anchorX = 'center';
                theLocator.anchorY = 'center';
                theLocator.strokeWidth = 0;
                theLocator.iVoLVERType = 'Locator';
                theLocator.locationLineCompletionLevel = 0;
            }
        });
        iVoLVER.util.extends(locatorClass, iVoLVER.obj.Locator);
        return locatorClass;
    },
    setOpacityOfLocationProperties: function (theLocatable, opacity) {
        var theLocator = theLocatable.locator;
        theLocatable.locationProperties.forEach(function (locationProperty) {
            locationProperty.opacity = opacity;
            var expandedOptions = theLocator.getStateProperties(locationProperty, true);
            expandedOptions.opacity = opacity;
            locationProperty.inConnections.forEach(function (inConnection) {
                inConnection.opacity = opacity;
            });
            locationProperty.outConnections.forEach(function (outConnection) {
                outConnection.opacity = opacity;
            });
        });
    },
    selectLocatableObject: function (theLocatable) {
        var theLocator = this;
        // deselecting ALL the locatable objects of the locator
        theLocator.deselectLocatableObjects();

        // selecting this one (essentially, showing its location properties)
        theLocatable.selected = true;
        theLocator.setOpacityOfLocationProperties(theLocatable, 1);
    },
    deselectLocatableObjects: function () {
        var theLocator = this;
        theLocator.objects.forEach(function (object, index) {
            if (object.isLocatable) {
                object.selected = false;
                theLocator.setOpacityOfLocationProperties(object, 0);
            }
        });
    },
    registerLocatorEvents: function () {
        var theLocator = this;
        theLocator.registerListener('added', function (options) {
            theLocator.createAxesDescription();
            theLocator.addAxes();
            theLocator.createArrowHeadsDescription();
            theLocator.addArrowHeads();
            theLocator.createAxesLengthsDescription();
            if (theLocator.animateBirth) {
                animateBirth(theLocator, false, 1, 1, function () {
                    theLocator.positionObjects();
                });
            }
        });
        theLocator.registerListener('moving', function (options) {
            updateConnectorsPositions(theLocator);
        });
    },
    updateAxesLengths: function (withAnimation) {

        var theLocator = this;

        theLocator.updateBoundLimits();

        var axes = theLocator.axesLengthsDescription;
        var padding = 30;

        axes.forEach(function (axisObject) {

            var axisLineObject = theLocator[axisObject.name];
            var tipObject = theLocator[axisObject.name + 'Tip'];
            var expandedOptionsAxisLine = theLocator.getStateProperties(axisLineObject, true);
            var expandedOptionsTip = theLocator.getStateProperties(tipObject, true);
            var currentCoordinate = expandedOptionsAxisLine[axisObject.limit + '2'];

            var newCoordinate = axisObject.boundLimit - padding;

            if (axisObject.boundLimit > 0) {
                // apply correction to gurantee the minimum defined for each axis
                newCoordinate = -axisObject.minLength;
            }

            if (!theLocator.isCompressed) {
                if (withAnimation) {
                    fabric.util.animate({
                        easing: fabric.util.ease.easeInBack,
                        duration: 500,
                        startValue: currentCoordinate,
                        endValue: newCoordinate,
                        onChange: function (currentValue) {
                            expandedOptionsAxisLine[axisObject.limit + '2'] = currentValue;
                            if (axisObject.useNegative) {
                                currentValue *= -1;
                            }
                            expandedOptionsTip[axisObject.limit] = -currentValue - axisObject.arrowDistance;
                            theLocator.positionObjects();
                        }
                    });
                } else {
                    expandedOptionsAxisLine[axisObject.limit + '2'] = newCoordinate;
                    if (axisObject.useNegative) {
                        newCoordinate *= -1;
                    }
                    expandedOptionsTip[axisObject.limit] = -newCoordinate - axisObject.arrowDistance;
                    theLocator.positionObjects();
                }
            } else {
                expandedOptionsAxisLine[axisObject.limit + '2'] = newCoordinate;
                if (axisObject.useNegative) {
                    newCoordinate *= -1;
                }
                expandedOptionsTip[axisObject.limit] = -newCoordinate - axisObject.arrowDistance;
            }
        });
    },
    addAxes: function () {

        var theLocator = this;
        var axes = theLocator.axes;

        for (var axis in axes) {

            var axisLine = new fabric.Line(axes[axis].lineCoordinates, {
                stroke: 'black',
                fill: 'black',
                strokeWidth: theLocator.axisLineStrokeWidth,
                hasBorder: false,
                hasControls: false,
                hasRotatingPoint: false,
                borderColor: 'transparent',
                perPixelTargetFind: true,
                selectable: false,
                evented: false,
                originX: axes[axis].objectOriginX,
                originY: axes[axis].objectOriginY,
                objectCaching: false
            });

            theLocator.addChild(axisLine, {
                whenCompressed: {
                    x: axes[axis].x,
                    y: axes[axis].y,
                    x2: axes[axis].lineCoordinates[0] + axes[axis].deltaX,
                    y2: axes[axis].lineCoordinates[1] + axes[axis].deltaY,
                    originParent: {originX: axes[axis].locatorOriginX, originY: axes[axis].locatorOriginY},
                    originChild: {originX: axes[axis].objectOriginX, originY: axes[axis].objectOriginY},
                    scaleX: 1,
                    scaleY: 1,
                    opacity: 1
                },
                whenExpanded: {
                    x: axes[axis].x,
                    y: axes[axis].y,
                    x2: axes[axis].lineCoordinates[2],
                    y2: axes[axis].lineCoordinates[3],
                    originParent: {originX: axes[axis].locatorOriginX, originY: axes[axis].locatorOriginY},
                    originChild: {originX: axes[axis].objectOriginX, originY: axes[axis].objectOriginY},
                }
            });

            theLocator[axis] = axisLine;

            canvas.add(axisLine);
        }

    },
    addArrowHeads: function () {

        var theLocator = this;
        var arrowHeads = theLocator.arrowHeads;

        for (var arrowHead in arrowHeads) {

            var polygonTip = new fabric.Polygon(arrowHeads[arrowHead].points, {
                width: 10,
                height: 15,
                fill: 'black',
                stroke: 'transparent',
                strokeWidth: 0,
                hasBorder: false,
                hasControls: false,
                hasRotatingPoint: false,
                borderColor: 'transparent',
                perPixelTargetFind: true,
                evented: false,
                selectable: false,
                objectCaching: false
            });

            theLocator.addChild(polygonTip, {
                whenCompressed: {
                    x: arrowHeads[arrowHead].compressedX,
                    y: arrowHeads[arrowHead].compressedY,
                    scaleX: arrowHeads[arrowHead].scaleXCompressed,
                    scaleY: arrowHeads[arrowHead].scaleYCompressed,
                    opacity: arrowHeads[arrowHead].opacityCompressed,
                    originParent: {originX: arrowHeads[arrowHead].locatorOriginX, originY: arrowHeads[arrowHead].locatorOriginY},
                    originChild: {originX: arrowHeads[arrowHead].objectOriginX, originY: arrowHeads[arrowHead].objectOriginY},
                },
                whenExpanded: {
                    x: arrowHeads[arrowHead].expandedX,
                    y: arrowHeads[arrowHead].expandedY,
                    originParent: {originX: arrowHeads[arrowHead].locatorOriginX, originY: arrowHeads[arrowHead].locatorOriginY},
                    originChild: {originX: arrowHeads[arrowHead].objectOriginX, originY: arrowHeads[arrowHead].objectOriginY},
                }
            });
            theLocator[arrowHead + 'Tip'] = polygonTip;
            canvas.add(polygonTip);
        }
    },
    connectionAccepted: function (theConnector, theLocatable) {

        var theLocator = this;
        theLocatable._renderLocationLines = theLocator.locationLinesRenderingMethod;
        theLocatable.getSVGForLocationLines = theLocator.getSVGForLocationLines;

        theLocator.computeLocatableCoordinates(theLocatable);

        theLocator.updateAxesLengths(true, true);

        theLocator.createLocationProperties(theLocatable);

        theLocatable.locked = true;

        // If the locator was expanded, the newly created connection should be hidden
        if (!theLocator.isCompressed) {
            fabric.util.animate({
                easing: fabric.util.ease.easeInBack,
                duration: 500,
                startValue: 0,
                endValue: 1,
                onChange: function (currentValue) {
                    var locationLineCompletionLevel = iVoLVER.util.correctValueWithLimits(currentValue, 0, 1);
                    theLocatable.locationLineCompletionLevel = locationLineCompletionLevel;
                    theConnector.opacity = 1 - locationLineCompletionLevel;
                },
                onComplete: function () {
                    theLocator.selectLocatableObject(theLocatable);
                }
            });
        }

        theLocator.registerLocatableEvents(theLocatable);

    },
    initializeLocator: function () {
        var theLocator = this;
        if (iVoLVER.util.isUndefined(theLocator.events)) {
            theLocator.events = new Array();
        }
        theLocator.initExpandable({
            duration: 750
        });
        theLocator.initConnectable({
            undirectedConnections: true,
            allowOutConnections: true,
            allowInConnections: true
        });
        theLocator.registerLocatorEvents();
    },
    setOpacityOfConnectors: function (value) {
        var theLocator = this;
        theLocator.outConnections.forEach(function (connection) {
            connection.opacity = value;
        });
    },
    setLocatableLocationLineCompletionLevels: function (value) {
        var theLocator = this;
        theLocator.objects.forEach(function (object, index) {
            if (object.isLocatable) {
                var locationLineCompletionLevel = iVoLVER.util.correctValueWithLimits(value, 0, 1);
                object.locationLineCompletionLevel = locationLineCompletionLevel;
            }
        });
    },
    // EXPANDABLE FUNCTIONS OF THE LOCATOR
    onChangeExpanding: function (currentValue) {
        var theLocator = this;
        var opacity = iVoLVER.util.correctValueWithLimits(1 - currentValue, 0, 1);
        theLocator.setOpacityOfConnectors(opacity);

        var completionLevel = iVoLVER.util.correctValueWithLimits(currentValue, 0, 1);
        theLocator.setLocatableLocationLineCompletionLevels(completionLevel);
    },
    afterExpanding: function () {
        var theLocator = this;
    },
    onChangeCompressing: function (currentValue) {
        var theLocator = this;

        var opacity = iVoLVER.util.correctValueWithLimits(1 - currentValue, 0, 1);
        theLocator.setOpacityOfConnectors(opacity);

        var completionLevel = iVoLVER.util.correctValueWithLimits(currentValue, 0, 1);
        theLocator.setLocatableLocationLineCompletionLevels(completionLevel);


        theLocator.objects.forEach(function (object, index) {
            if (object.isLocatable && object.selected) {
                object.locationProperties.forEach(function (locationProperty) {
                    locationProperty.opacity = completionLevel;
                    var expandedOptions = theLocator.getStateProperties(locationProperty, true);
                    expandedOptions.opacity = completionLevel;
                    locationProperty.inConnections.forEach(function (inConnection) {
                        inConnection.opacity = completionLevel;
                    });
                    locationProperty.outConnections.forEach(function (outConnection) {
                        outConnection.opacity = completionLevel;
                    });
                });
            }
        });




    },
    afterCompressing: function () {
        var theLocator = this;
        theLocator.deselectLocatableObjects();
    },
    // CONNECTABLE FUNCTIONS OF THE LOCATOR
    processConnectionRequest: function (theConnector) {
        var sourceObject = theConnector.source;
        var connectionAccepted = null;
        var message = null;
        var processedValue = null;
        if (sourceObject.isLocator) {
            connectionAccepted = true;
        } else {
            connectionAccepted = false;
            message = 'Invalid connection.';
        }
        return {
            connectionAccepted: connectionAccepted,
            message: message,
            processedValue: processedValue
        };
    },
    acceptConnection: function (theConnector, value) {

        var thisLocator = this;
        if (thisLocator.inConnections.length > 1) {
            var connector = thisLocator.inConnections.pop();
            if (connector) {
                connector.contract();
            }
        }


//        var otherLocator = theConnector.source;
//        otherLocator.connectionAccepted(theConnector, thisLocator);
//        otherLocator.registerLocatableEvents(thisLocator);

    },
//    rejectConnection: function (theConnector) {
//        theConnector.contract();
//    },
    toString: function () {
        return '#<iVoLVER.' + this.iVoLVERType + '>';
    },
};
iVoLVER.util.extends(iVoLVER.obj.Locator, iVoLVER.model.Expandable);
iVoLVER.util.extends(iVoLVER.obj.Locator, iVoLVER.model.Connectable);
//iVoLVER.util.extends(iVoLVER.obj.Locator, iVoLVER.model.Locatable);

///////////////////////
// CARTESIAN LOCATOR //
///////////////////////

iVoLVER.obj.CartesianLocator = function (options) {

    CartesianLocatorClass = iVoLVER.obj.Locator.createClass(fabric.Rect);

    options.width = 45;
    options.height = 45;
    options.objectCaching = false;

    var cartesianLocator = new CartesianLocatorClass(options);

    cartesianLocator.getSVGForLocationLines = function () {
        var locationLines = new Array();
        var theLocatable = this;
        var theLocator = theLocatable.locator;
        if (theLocator) {
            var markCenter = theLocatable.anchorPoint.getCenterPoint();

            if (!theLocator.isCompressed) {

                var stroke = theLocatable.stroke;
                var strokeWidth = 2;
                var strokeDashArray = [8, 8];

                var hPoints = [markCenter.x, markCenter.y, markCenter.x - theLocatable.xCoordinate, markCenter.y];
                var hLine = new fabric.Line(hPoints, {
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    strokeDashArray: strokeDashArray
                });
                locationLines.push(hLine.toSVG());

                var relativeX = -theLocatable.xCoordinate;
                var relativeY = -theLocatable.yCoordinate;
                var verticalOffset = 0;
                var horizontalOffset = 0;
                var x1 = null;
                var originX = null;
                var originY = null;

                // text of the Y property
                if (relativeX < 0) {
                    originX = "right";
                    if (theLocatable.selected) {
                        x1 = (horizontalOffset + relativeX - 30) / theLocatable.scaleX;
                    } else {
                        x1 = (horizontalOffset + relativeX - 8) / theLocatable.scaleX;
                    }
                } else {
                    originX = "left";
                    if (theLocatable.selected) {
                        x1 = (horizontalOffset + relativeX + 30) / theLocatable.scaleX;
                    } else {
                        x1 = (horizontalOffset + relativeX + 8) / theLocatable.scaleX;
                    }
                }

                if (relativeY < 0) {
                    originY = 'top';
                } else {
                    originY = 'bottom';
                }

                var yDot = new fabric.Circle({
                    originX: 'center',
                    originY: 'center',
                    left: markCenter.x - theLocatable.xCoordinate,
                    top: markCenter.y,
                    fill: stroke,
                    stroke: stroke,
                    radius: 4,
                });
                locationLines.push(yDot.toSVG());

                var ylabel = new fabric.Text(relativeY.toFixed(2), {
                    originX: originX,
                    originY: 'center',
                    left: markCenter.x + x1,
                    top: markCenter.y,
                    fontSize: 16,
                    fill: '#000000',
                    fontFamily: 'Helvetica'
                });
                locationLines.push(ylabel.toSVG());

                var vPoints = [markCenter.x, markCenter.y, markCenter.x, markCenter.y - theLocatable.yCoordinate];
                var vLine = new fabric.Line(vPoints, {
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    strokeDashArray: strokeDashArray
                });
                locationLines.push(vLine.toSVG());

                var xDot = new fabric.Circle({
                    originX: 'center',
                    originY: 'center',
                    left: markCenter.x,
                    top: markCenter.y - theLocatable.yCoordinate,
                    fill: stroke,
                    stroke: stroke,
                    radius: 4,
                });
                locationLines.push(xDot.toSVG());

                var d = 3;
                var y2 = (verticalOffset + (relativeY + d) * theLocatable.locationLineCompletionLevel) / theLocatable.scaleY;
                var delta;
                if (relativeY < 0) {
                    delta = theLocatable.selected ? -33 : -10;
                } else {
                    delta = theLocatable.selected ? 45 : 20;
                }
                var xlabel = new fabric.Text((-relativeX).toFixed(2), {
                    originX: 'center',
                    originY: originY,
                    left: markCenter.x,
                    top: y2 + markCenter.y + delta,
                    fontSize: 16,
                    fill: '#000000',
                    fontFamily: 'Helvetica'
                });
                locationLines.push(xlabel.toSVG());

            }

        }
        return locationLines;
    };

    cartesianLocator.locationLinesRenderingMethod = function (ctx) {

        var theLocatable = this;

        if (theLocatable.locator) {

            var markCenter = theLocatable.anchorPoint.getCenterPoint();

            ctx.save();

            var relativeX = -theLocatable.xCoordinate;
            var relativeY = -theLocatable.yCoordinate;

            if (theLocatable.iVoLVERType !== 'PathGroupMark') {
                ctx.rotate(-fabric.util.degreesToRadians(theLocatable.angle));
            }
            if (theLocatable.stroke === 'transparent') {
                ctx.strokeStyle = 'rgb(63,63,63)';
            }
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.beginPath();

            var originX = null;
            var originY = null;

            if (relativeY < 0) {
                originY = 'top';
            } else {
                originY = 'bottom';
            }

            if (relativeX < 0) {
                originX = 'left';
            } else {
                originX = 'right';
            }

            var verticalOffset = 0;
            var horizontalOffset = 0;

            if (theLocatable.iVoLVERType !== 'PathGroupMark') {
                if (theLocatable.anchorX === 'left') {
                    horizontalOffset = -theLocatable.width / 2;
                } else if (theLocatable.anchorX === 'right') {
                    horizontalOffset = theLocatable.width / 2;
                }
                if (theLocatable.anchorY === 'top') {
                    verticalOffset = -theLocatable.height / 2;
                } else if (theLocatable.anchorY === 'bottom') {
                    verticalOffset = theLocatable.height / 2;
                }
            }

            var d = 3;

            // VERTICAL line (the one intersecting the X axis)
            var x = horizontalOffset / theLocatable.scaleX;
            var y1 = verticalOffset / theLocatable.scaleY;
            var y2 = (verticalOffset + (relativeY + d) * theLocatable.locationLineCompletionLevel) / theLocatable.scaleY;


            if (theLocatable.iVoLVERType === 'PathGroupMark') {

                var deltaWidth = (theLocatable.getScaledWidth() - theLocatable.width) / 2;
                var deltaHeight = (theLocatable.getScaledHeight() - theLocatable.height) / 2;

                if (theLocatable.anchorX === 'left') {
                    x += markCenter.x - deltaWidth;
                } else if (theLocatable.anchorX === 'right') {
                    x += markCenter.x + deltaWidth;
                } else {
                    x += markCenter.x;
                }
                if (theLocatable.anchorY === 'top') {
                    y1 += markCenter.y - deltaHeight;
                } else if (theLocatable.anchorY === 'bottom') {
                    y1 += markCenter.y + deltaHeight;
                } else {
                    y1 += markCenter.y;
                }
                y2 = markCenter.y + y2 * theLocatable.scaleY;
            }

            ctx.moveTo(x, y1);
            ctx.lineTo(x, y2);
            ctx.stroke();
            ctx.restore();

            // little dot on the Y axis
            ctx.save();
            ctx.fillStyle = ctx.strokeStyle;
            var pointRadius = iVoLVER.util.computeNormalizedValue(3, 5, theLocatable.locationLineCompletionLevel);
            ctx.beginPath();
            ctx.arc(x, y2 - iVoLVER.util.computeNormalizedValue(0, pointRadius / 2, theLocatable.locationLineCompletionLevel), pointRadius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // text showing the value of the X property
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,' + theLocatable.locationLineCompletionLevel + ')';
            ctx.font = "16px sans-serif";
            ctx.textAlign = "center";

            var delta;
            if (relativeY < 0) {
                delta = theLocatable.selected ? -33 : -10;
            } else {
                delta = theLocatable.selected ? 40 : 20;
            }
            ctx.fillText(-relativeX.toFixed(2), x, y2 + delta);
            ctx.restore();
            ctx.save();

            var relativeX = -theLocatable.xCoordinate;
            var relativeY = -theLocatable.yCoordinate;

            if (theLocatable.iVoLVERType !== 'PathGroupMark') {
                ctx.rotate(-fabric.util.degreesToRadians(theLocatable.angle));
            }
            if (theLocatable.stroke === 'transparent') {
                ctx.strokeStyle = 'rgb(63,63,63)';
            }
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.beginPath();

            // HORIZONTAL line (the one intersecting the Y axis)
            var x1 = horizontalOffset / theLocatable.scaleX;
            var x2 = (horizontalOffset + (relativeX + d) * theLocatable.locationLineCompletionLevel) / theLocatable.scaleX;
            var y = verticalOffset / theLocatable.scaleY;

            if (theLocatable.iVoLVERType === 'PathGroupMark') {
                var deltaWidth = (theLocatable.getScaledWidth() - theLocatable.width) / 2;
                if (theLocatable.anchorX === 'left') {
                    x1 += markCenter.x - deltaWidth;
                } else if (theLocatable.anchorX === 'right') {
                    x1 += markCenter.x + deltaWidth;
                } else {
                    x1 += markCenter.x;
                }
                if (theLocatable.anchorY === 'top') {
                    y += markCenter.y - deltaHeight;
                } else if (theLocatable.anchorY === 'bottom') {
                    y += markCenter.y + deltaHeight;

                } else {
                    y += markCenter.y;
                }
                x2 = markCenter.x + x2 * theLocatable.scaleX;
            }
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();
            ctx.restore();

            // little dot on the Y axis
            ctx.save();
            ctx.fillStyle = ctx.strokeStyle;
            var pointRadius = iVoLVER.util.computeNormalizedValue(3, 5, theLocatable.locationLineCompletionLevel);
            ctx.beginPath();
            var pss = x2 - iVoLVER.util.computeNormalizedValue(0, pointRadius / 2, theLocatable.locationLineCompletionLevel);
            ctx.arc(pss, y, pointRadius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            ctx.save();

            ctx.fillStyle = 'rgba(0,0,0,' + theLocatable.locationLineCompletionLevel + ')';
            ctx.font = "16px sans-serif";

            // text of the Y property
            if (relativeX < 0) {
                ctx.textAlign = "right";
                if (theLocatable.selected) {
                    x1 = (horizontalOffset + relativeX - 30) / theLocatable.scaleX;
                } else {
                    x1 = (horizontalOffset + relativeX - 8) / theLocatable.scaleX;
                }
            } else {
                ctx.textAlign = "left";
                if (theLocatable.selected) {
                    x1 = (horizontalOffset + relativeX + 30) / theLocatable.scaleX;
                } else {
                    x1 = (horizontalOffset + relativeX + 8) / theLocatable.scaleX;
                }
            }
            y1 = (verticalOffset + 5) / theLocatable.scaleY;
            if (theLocatable.iVoLVERType === 'PathGroupMark') {
                x1 += markCenter.x + 30;
                y1 += markCenter.y;
            }

            var delta;
            if (relativeX < 0) {
                delta = theLocatable.selected ? -33 : -10;
            } else {
                delta = theLocatable.selected ? 30 : 10;
            }

            ctx.fillText(relativeY.toFixed(2), pss + delta, y1);
            ctx.restore();

        }
    };

    cartesianLocator.previousRender = cartesianLocator._render;

    cartesianLocator._render = function (ctx) {
        cartesianLocator.previousRender(ctx);
        ctx.beginPath();
        ctx.save();

        var side = 8;
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.rect(-side / 2, -side / 2, side, side);
        ctx.fill();

        ctx.restore();
        ctx.closePath();

    };

    cartesianLocator.createAxesDescription = function () {

        var theLocator = this;

        var d = 7;
        theLocator.minLength = 100;
        theLocator.axisLineStrokeWidth = 4;

        theLocator.axes = {
            positiveX: {
                locatorOriginX: 'right',
                locatorOriginY: 'center',
                objectOriginX: 'left',
                objectOriginY: 'center',
                lineCoordinates: [0, 0, cartesianLocator.minLength, 0],
                x: -d,
                y: 0,
                deltaX: 15,
                deltaY: 0
            },
            negativeX: {
                locatorOriginX: 'left',
                locatorOriginY: 'center',
                objectOriginX: 'right',
                objectOriginY: 'center',
                lineCoordinates: [0, 0, 15, 0],
                x: d,
                y: 0,
                deltaX: 15,
                deltaY: 0
            },
            positiveY: {
                locatorOriginX: 'center',
                locatorOriginY: 'top',
                objectOriginX: 'center',
                objectOriginY: 'bottom',
                lineCoordinates: [0, 0, 0, cartesianLocator.minLength],
                x: 0,
                y: d,
                deltaX: 0,
                deltaY: 15
            },
            negativeY: {
                locatorOriginX: 'center',
                locatorOriginY: 'bottom',
                objectOriginX: 'center',
                objectOriginY: 'top',
                lineCoordinates: [0, 0, 0, 15],
                x: 0,
                y: -d,
                deltaX: 0,
                deltaY: 15
            }
        };

    };

    cartesianLocator.createArrowHeadsDescription = function () {

        var theLocator = this;

        theLocator.arrowHeads = {
            positiveX: {
                points: [{x: 0, y: 0}, {x: 15, y: 5}, {x: 0, y: 10}],
                stroke: 'green',
                compressedX: 5,
                expandedX: theLocator.minLength - 10,
                compressedY: 0,
                expandedY: 0,
                locatorOriginX: 'right',
                locatorOriginY: 'center',
                objectOriginX: 'left',
                objectOriginY: 'center',
                scaleXCompressed: 1,
                scaleYCompressed: 1,
                opacityCompressed: 1
            },
            negativeX: {
                points: [{x: 0, y: 0}, {x: 15, y: 5}, {x: 15, y: -5}],
                stroke: 'green',
                compressedX: -5,
                expandedX: -5,
                compressedY: 0,
                expandedY: 0,
                locatorOriginX: 'left',
                locatorOriginY: 'center',
                objectOriginX: 'right',
                objectOriginY: 'center',
                scaleXCompressed: 0,
                scaleYCompressed: 0,
                opacityCompressed: 0
            },
            positiveY: {
                points: [{x: 0, y: 0}, {x: 5, y: -15}, {x: 10, y: 0}],
                stroke: 'green',
                compressedX: 0,
                expandedX: 0,
                compressedY: -5,
                expandedY: -(theLocator.minLength - 10),
                locatorOriginX: 'center',
                locatorOriginY: 'top',
                objectOriginX: 'center',
                objectOriginY: 'bottom',
                scaleXCompressed: 1,
                scaleYCompressed: 1,
                opacityCompressed: 1
            },
            negativeY: {
                points: [{x: 0, y: 0}, {x: 5, y: 15}, {x: 10, y: 0}],
                stroke: 'green',
                compressedX: 0,
                expandedX: 0,
                compressedY: 5,
                expandedY: 5,
                locatorOriginX: 'center',
                locatorOriginY: 'bottom',
                objectOriginX: 'center',
                objectOriginY: 'top',
                scaleXCompressed: 0,
                scaleYCompressed: 0,
                opacityCompressed: 0
            }
        };
    };

    cartesianLocator.updateBoundLimits = function () {

        var theLocator = this;
        var marksBoundLimits = theLocator.getMarksBoundLimits();

        theLocator.axesLengthsDescription[0].boundLimit = marksBoundLimits.rightmost;
        theLocator.axesLengthsDescription[1].boundLimit = marksBoundLimits.leftmost;
        theLocator.axesLengthsDescription[2].boundLimit = marksBoundLimits.topmost;
        theLocator.axesLengthsDescription[3].boundLimit = marksBoundLimits.bottommost;

    };

    cartesianLocator.createAxesLengthsDescription = function (withAnimation) {

        var theLocator = this;
        var marksBoundLimits = theLocator.getMarksBoundLimits();

        theLocator.axesLengthsDescription = [{
                name: 'positiveX',
                locatorOriginX: 'right',
                locatorOriginY: 'center',
                limit: 'x',
                arrowDistance: 10,
                boundLimit: marksBoundLimits.rightmost,
                minLength: 100,
            }, {
                name: 'negativeX',
                locatorOriginX: 'left',
                locatorOriginY: 'center',
                limit: 'x',
                arrowDistance: -10,
                boundLimit: marksBoundLimits.leftmost,
                useNegative: true,
                minLength: 15,
            }, {
                name: 'positiveY',
                locatorOriginX: 'center',
                locatorOriginY: 'top',
                limit: 'y',
                arrowDistance: -10,
                boundLimit: marksBoundLimits.topmost,
                minLength: 100,
                useNegative: true,
            }, {
                name: 'negativeY',
                locatorOriginX: 'center',
                locatorOriginY: 'bottom',
                limit: 'y',
                arrowDistance: 10,
                boundLimit: marksBoundLimits.bottommost,
                minLength: 15,
            }
        ];

    };

    cartesianLocator.registerLocatableEvents = function (theLocatable) {

        var theLocator = this;

        theLocatable.registerListener('selected', function (options) {

            if (!theLocator.isCompressing) {

                // deselecting ALL the locatable objects of the locator
                theLocator.deselectLocatableObjects();

                // selecting this one (essentially, showing its location properties)
                theLocatable.selected = true;
                theLocator.setOpacityOfLocationProperties(theLocatable, 1);
            }
        });

        theLocatable.registerListener('moving', function (options) {

//            // console.log("moving locatable");

            var theLocator = theLocatable.locator;

            if (!theLocatable.selected) {
                if (!theLocator.isCompressed) {
                    theLocatable.selected = true;
                    theLocator.setOpacityOfLocationProperties(theLocatable, 1);
                }
            }

            if (theLocator) {

//                // console.log("1111111");

                theLocatable.setCoords && theLocatable.setCoords();

                var locatorCenter = theLocator.getPointByOrigin('center', 'center');

                var targetPosition = theLocatable.getPointByOrigin(theLocatable.anchorX, theLocatable.anchorY);

//                // console.log(targetPosition.x);
//                // console.log(locatorCenter.x);

                // updating the mark's position attributes
                theLocatable.xCoordinate = targetPosition.x - locatorCenter.x;
                theLocatable.yCoordinate = targetPosition.y - locatorCenter.y;


//                // console.log(theLocatable.xCoordinate);

                var markCompressedOptions = theLocator.getStateProperties(theLocatable, false);
                markCompressedOptions.x = theLocatable.xCoordinate;
                markCompressedOptions.y = theLocatable.yCoordinate;

                var markExpandedOptions = theLocator.getStateProperties(theLocatable, true);
                markExpandedOptions.x = theLocatable.xCoordinate;
                markExpandedOptions.y = theLocatable.yCoordinate;

                var xPropertyCompressedOptions = theLocator.getStateProperties(theLocatable.xProperty, false);
                xPropertyCompressedOptions.x = theLocatable.xCoordinate;
                var xPropertyExpandedOptions = theLocator.getStateProperties(theLocatable.xProperty, true);
                xPropertyExpandedOptions.x = theLocatable.xCoordinate;

                var yPropertyCompressedOptions = theLocator.getStateProperties(theLocatable.yProperty, false);
                yPropertyCompressedOptions.y = theLocatable.yCoordinate;
                var yPropertyExpandedOptions = theLocator.getStateProperties(theLocatable.yProperty, true);
                yPropertyExpandedOptions.y = theLocatable.yCoordinate;

                // disconnecting the location properties when the value they hold is not the right one
                if (!theLocatable.locked) {
                    if (theLocatable.xProperty.value.number !== theLocatable.xCoordinate) {
                        theLocatable.xProperty.disconnect(true, false);
                    }
                    if (theLocatable.yProperty.value.number !== -theLocatable.yCoordinate) {
                        theLocatable.yProperty.disconnect(true, false);
                    }
                }

                theLocatable.xProperty.setValue(createNumberValue({unscaledValue: theLocatable.xCoordinate}), false, true);
                theLocatable.yProperty.setValue(createNumberValue({unscaledValue: -theLocatable.yCoordinate}), false, true);
                theLocator.positionObjects();

                theLocator.updateAxesLengths(false, false);

            }
        });
    };


    cartesianLocator.computeLocatableCoordinates = function (theLocatable) {

        var theLocator = this;

        var locatorCenter = theLocator.getPointByOrigin('center', 'center');
        var targetPosition = theLocatable.getPointByOrigin(theLocatable.anchorX, theLocatable.anchorY);
        var x = targetPosition.x - locatorCenter.x;
        var y = targetPosition.y - locatorCenter.y;

        theLocator.addChild(theLocatable, {
            whenCompressed: {
                x: x,
                y: y,
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                originChild: {originX: theLocatable.anchorX, originY: theLocatable.anchorY},
            },
            whenExpanded: {
                x: x,
                y: y,
                originChild: {originX: theLocatable.anchorX, originY: theLocatable.anchorY},
            }
        });

        theLocatable.locator = theLocator;
        theLocatable.xCoordinate = x;
        theLocatable.yCoordinate = y;

    };


    // Each locator is responsible to create the location properties of an object
    // (because only the locator itself is able to know what properties it will need to locate a given object)
    cartesianLocator.createLocationProperties = function (object) {

        var theLocator = this;

        var xProperty = new iVoLVER.model.ValueHolder({
            value: 123,
            fill: object.fill,
            stroke: object.stroke !== 'transparent' ? object.stroke : 'rgb(63,63,63)',
            name: 'xCoordinate',
            path: paths.x.rw,
            locatable: object,
            showLabel: false
        });

        var yProperty = new iVoLVER.model.ValueHolder({
            value: 100,
            fill: object.fill,
            stroke: object.stroke !== 'transparent' ? object.stroke : 'rgb(63,63,63)',
            name: 'yCoordinate',
            path: paths.y.rw,
            locatable: object,
            showLabel: false
        });

        object.locationProperties = new Array();
        object.locationProperties.push(xProperty);
        object.locationProperties.push(yProperty);

        object.xProperty = xProperty;
        object.yProperty = yProperty;

        theLocator.addChild(object.xProperty, {
            whenCompressed: {
                x: object.xCoordinate,
                y: 0,
            },
            whenExpanded: {
                x: object.xCoordinate,
                y: 0,
                opacity: 0
            },
            movable: false
        });

        theLocator.addChild(object.yProperty, {
            whenCompressed: {
                x: 0,
                y: object.yCoordinate,
            },
            whenExpanded: {
                x: 0,
                y: object.yCoordinate,
                opacity: 0
            },
            movable: false
        });

        xProperty.beforeRender = iVoLVER.obj.Mark.beforeRenderCircularVisualProperty;
        yProperty.beforeRender = iVoLVER.obj.Mark.beforeRenderCircularVisualProperty;

        canvas.add(object.xProperty);
        canvas.add(object.yProperty);

        // x property event
        theLocator.subscribe(xProperty, 'valueSet', function (subscriber, subscribable, eventOptions) {

            var withAnimation = eventOptions.withAnimation;

            var theValue = xProperty.value;
            var number = theValue.number;

            var theLocatable = object;
            var oldX = theLocatable.xCoordinate;


            var xPropertyCompressedOptions = theLocator.getStateProperties(xProperty, false);
            var xPropertyExpandedOptions = theLocator.getStateProperties(xProperty, true);
            var locatableCompressedOptions = theLocator.getStateProperties(theLocatable, false);
            var locatableExpandedOptions = theLocator.getStateProperties(theLocatable, true);

            if (withAnimation) {
                fabric.util.animate({
                    easing: fabric.util.ease.easeOutBack,
                    duration: 500,
                    startValue: 0,
                    endValue: 1,
                    onChange: function (currentValue) {
                        var newX = iVoLVER.util.computeNormalizedValue(oldX, number, currentValue);
                        theLocatable.xCoordinate = newX;
                        xPropertyCompressedOptions.x = newX;
                        xPropertyExpandedOptions.x = newX;
                        locatableCompressedOptions.x = newX;
                        locatableExpandedOptions.x = newX;
                        theLocator.positionObjects();
                        theLocator.updateAxesLengths(false, false);

                    }
                });
            } else {
                theLocatable.xCoordinate = number;
                xPropertyCompressedOptions.x = number;
                xPropertyExpandedOptions.x = number;
                locatableCompressedOptions.x = number;
                locatableExpandedOptions.x = number;
                theLocator.positionObjects();
                theLocator.updateAxesLengths(false, false);
            }
        });


        // y property event
        theLocator.subscribe(yProperty, 'valueSet', function (subscriber, subscribable, eventOptions) {

            var withAnimation = eventOptions.withAnimation;

            var theValue = yProperty.value;
            var number = theValue.number;

            var theLocatable = object;
            var oldY = -theLocatable.yCoordinate;

            var yPropertyCompressedOptions = theLocator.getStateProperties(yProperty, false);
            var yPropertyExpandedOptions = theLocator.getStateProperties(yProperty, true);
            var locatableCompressedOptions = theLocator.getStateProperties(theLocatable, false);
            var locatableExpandedOptions = theLocator.getStateProperties(theLocatable, true);

            if (withAnimation) {
                fabric.util.animate({
                    easing: fabric.util.ease.easeOutBack,
                    duration: 500,
                    startValue: 0,
                    endValue: 1,
                    onChange: function (currentValue) {
                        var newY = iVoLVER.util.computeNormalizedValue(oldY, number, currentValue);
                        theLocatable.yCoordinate = -newY;
                        yPropertyCompressedOptions.y = -newY;
                        yPropertyExpandedOptions.y = -newY;
                        locatableCompressedOptions.y = -newY;
                        locatableExpandedOptions.y = -newY;
                        theLocator.positionObjects();
                        theLocator.updateAxesLengths(false, false);

                    }
                });
            } else {
                theLocatable.yCoordinate = -number;
                yPropertyCompressedOptions.y = -number;
                yPropertyExpandedOptions.y = -number;
                locatableCompressedOptions.y = -number;
                locatableExpandedOptions.y = -number;
                theLocator.positionObjects();
                theLocator.updateAxesLengths(false, false);
            }
        });




    };

    return cartesianLocator;

}

///////////////////
// POLAR LOCATOR //
///////////////////

iVoLVER.obj.PolarLocator = function (options) {

    PolarLocatorClass = iVoLVER.obj.Locator.createClass(fabric.Circle);

    options.radius = 25;
    var polarLocator = new PolarLocatorClass(options);

    polarLocator.getSVGForLocationLines = function () {

        var locationLines = new Array();
        var theLocatable = this;
        var theLocator = theLocatable.locator;
        if (theLocator) {
            var markCenter = theLocatable.anchorPoint.getCenterPoint();
            var locatorCenter = theLocator.getCenterPoint();

            if (!theLocator.isCompressed) {

                var stroke = theLocatable.stroke;
                var strokeWidth = 2;
                var strokeDashArray = [8, 8];

                var points = [locatorCenter.x, locatorCenter.y, markCenter.x, markCenter.y];
                var line = new fabric.Line(points, {
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    strokeDashArray: strokeDashArray
                });
                locationLines.push(line.toSVG());

                var startAngle = (2 * Math.PI - fabric.util.degreesToRadians(theLocatable.angularCoordinate));
                var endAngle = (2 * Math.PI - (1 - theLocatable.locationLineCompletionLevel) * fabric.util.degreesToRadians(theLocatable.angularCoordinate / theLocatable.scaleY));

                var theLine = {p1: {x: locatorCenter.x, y: locatorCenter.y}, p2: {x: markCenter.x, y: markCenter.y}};
                var radius = computeLength(theLine);
                var arc = new fabric.Circle({
                    radius: radius,
                    originX: 'center',
                    originY: 'center',
                    left: locatorCenter.x,
                    top: locatorCenter.y,
                    startAngle: startAngle,
                    endAngle: endAngle,
                    fill: 'transparent',
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    strokeDashArray: strokeDashArray
                });
                locationLines.push(arc.toSVG());

                var yDot = new fabric.Circle({
                    originX: 'center',
                    originY: 'center',
                    left: locatorCenter.x + radius,
                    top: locatorCenter.y,
                    fill: stroke,
                    stroke: stroke,
                    radius: 4,
                });
                locationLines.push(yDot.toSVG());

                var relativeX = -theLocatable.xCoordinate;
                var relativeY = -theLocatable.yCoordinate;

                var verticalOffset = 0;

                if (theLocatable.anchorY === 'top') {
                    verticalOffset = -theLocatable.height / 2;
                } else if (theLocatable.anchorY === 'bottom') {
                    verticalOffset = theLocatable.height / 2;
                }

                var label = new fabric.Text(Math.abs(theLocatable.radialCoordinate).toFixed(2), {
                    originX: 'center',
                    originY: 'top',
                    left: locatorCenter.x + radius,
                    top: locatorCenter.y + (verticalOffset + 20) / theLocatable.scaleY,
                    fontSize: 16,
                    fill: '#000000',
                    fontFamily: 'Helvetica'
                });
                locationLines.push(label.toSVG());



            }

        }
        return locationLines;
    };

    polarLocator.createAxesDescription = function () {

        var theLocator = this;

        var d = 7;
        theLocator.minLength = 100;
        theLocator.axisLineStrokeWidth = 4;

        theLocator.axes = {
            positiveX: {
                locatorOriginX: 'right',
                locatorOriginY: 'center',
                objectOriginX: 'left',
                objectOriginY: 'center',
                lineCoordinates: [0, 0, polarLocator.minLength, 0],
                x: -d,
                y: 0,
                deltaX: 15,
                deltaY: 0
            },
            negativeX: {
                locatorOriginX: 'left',
                locatorOriginY: 'center',
                objectOriginX: 'right',
                objectOriginY: 'center',
                lineCoordinates: [0, 0, 15, 0],
                x: d,
                y: 0,
                deltaX: 15,
                deltaY: 0
            }
        };

    };

    polarLocator.locationLinesRenderingMethod = function (ctx) {

        var theLocatable = this;

        if (theLocatable.locator) {

            ctx.save();

            var relativeX = -theLocatable.xCoordinate;
            var relativeY = -theLocatable.yCoordinate;

            if (theLocatable.iVoLVERType !== 'PathGroupMark') {
                ctx.rotate(-fabric.util.degreesToRadians(theLocatable.angle));
            }

            if (theLocatable.stroke === 'transparent') {
                ctx.strokeStyle = 'rgb(63,63,63)';
            }

            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.beginPath();

            var markCenter = theLocatable.getCenterPoint();

            var originX = null;
            var originY = null;

            if (relativeY < 0) {
                originY = 'top';
            } else {
                originY = 'bottom';
            }

            if (relativeX < 0) {
                originX = 'left';
            } else {
                originX = 'right';
            }

            var verticalOffset = 0;
            var horizontalOffset = 0;

            if (theLocatable.anchorX === 'left') {
                horizontalOffset = -theLocatable.width / 2;
            } else if (theLocatable.anchorX === 'right') {
                horizontalOffset = theLocatable.width / 2;
            }

            if (theLocatable.anchorY === 'top') {
                verticalOffset = -theLocatable.height / 2;
            } else if (theLocatable.anchorY === 'bottom') {
                verticalOffset = theLocatable.height / 2;
            }

            // angle line
//            ctx.arc(horizontalOffset - theLocatable.xCoordinate, verticalOffset - theLocatable.yCoordinate, theLocatable.radialCoordinate, 2 * Math.PI - fabric.util.degreesToRadians(theLocatable.angularCoordinate), 2 * Math.PI - (1 - theLocatable.locationLineCompletionLevel) * fabric.util.degreesToRadians(theLocatable.angularCoordinate));

            ctx.arc(
                    (horizontalOffset - theLocatable.xCoordinate) / theLocatable.scaleX,
                    (verticalOffset - theLocatable.yCoordinate) / theLocatable.scaleY,
                    Math.abs(theLocatable.radialCoordinate / theLocatable.scaleY),
                    (2 * Math.PI - fabric.util.degreesToRadians(theLocatable.angularCoordinate)),
                    (2 * Math.PI - (1 - theLocatable.locationLineCompletionLevel) * fabric.util.degreesToRadians(theLocatable.angularCoordinate / theLocatable.scaleY))
                    );

            // radial line
//            ctx.moveTo(horizontalOffset, verticalOffset);
//            ctx.lineTo(horizontalOffset - theLocatable.xCoordinate * theLocatable.locationLineCompletionLevel, verticalOffset - theLocatable.yCoordinate * theLocatable.locationLineCompletionLevel);

            ctx.moveTo(horizontalOffset / theLocatable.scaleX, verticalOffset / theLocatable.scaleY);
            ctx.lineTo((horizontalOffset - theLocatable.xCoordinate * theLocatable.locationLineCompletionLevel) / theLocatable.scaleX, (verticalOffset - theLocatable.yCoordinate * theLocatable.locationLineCompletionLevel) / theLocatable.scaleY);


            ctx.stroke();


            ctx.closePath();

            ctx.save();

            ctx.beginPath();

            ctx.fillStyle = 'rgba(0,0,0,' + theLocatable.locationLineCompletionLevel + ')';
            ctx.font = "16px sans-serif";

            // text of the radial coordinate
            ctx.textAlign = "center";

            if (theLocatable.iVoLVERType === 'PathGroupMark') {
                ctx.fillText(-relativeX.toFixed(2), markCenter.x, markCenter.y + relativeY + 40);
            } else {

                if (theLocatable.selected) {
                    ctx.fillText(
                            Math.abs(theLocatable.radialCoordinate).toFixed(2),
                            (horizontalOffset + (theLocatable.radialCoordinate - theLocatable.radialCoordinate * Math.cos(fabric.util.degreesToRadians(theLocatable.angularCoordinate)))) / theLocatable.scaleX,
                            (relativeY + verticalOffset + 45) / theLocatable.scaleY);
                } else {
                    ctx.fillText(
                            Math.abs(theLocatable.radialCoordinate).toFixed(2),
                            (horizontalOffset + (theLocatable.radialCoordinate - theLocatable.radialCoordinate * Math.cos(fabric.util.degreesToRadians(theLocatable.angularCoordinate)))) / theLocatable.scaleX,
                            (relativeY + verticalOffset + 20) / theLocatable.scaleY);
                }
            }


            ctx.restore();

            ctx.save();
            ctx.fillStyle = ctx.strokeStyle;

            var pointRadius = iVoLVER.util.computeNormalizedValue(3, 5, theLocatable.locationLineCompletionLevel);

            // point on the R axis
            ctx.beginPath();
            var x = relativeX + horizontalOffset + theLocatable.radialCoordinate * Math.cos(fabric.util.degreesToRadians(theLocatable.angularCoordinate * (1 - theLocatable.locationLineCompletionLevel)));
            var y = relativeY + verticalOffset - theLocatable.radialCoordinate * Math.sin(fabric.util.degreesToRadians(theLocatable.angularCoordinate * (1 - theLocatable.locationLineCompletionLevel)));

            ctx.arc(x / theLocatable.scaleX, y / theLocatable.scaleY, pointRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
            ctx.restore();

            ctx.closePath();
            ctx.restore();
        }
    };

    polarLocator.previousRender = polarLocator._render;

    polarLocator._render = function (ctx) {
        polarLocator.previousRender(ctx);
        ctx.beginPath();
        ctx.save();

        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
        ctx.closePath();

    };

    polarLocator.createArrowHeadsDescription = function () {

        var theLocator = this;

        theLocator.arrowHeads = {
            positiveX: {
                points: [{x: 0, y: 0}, {x: 15, y: 5}, {x: 0, y: 10}],
                compressedX: 5,
                expandedX: theLocator.minLength - 10,
                compressedY: 0,
                expandedY: 0,
                locatorOriginX: 'right',
                locatorOriginY: 'center',
                objectOriginX: 'left',
                objectOriginY: 'center',
                scaleXCompressed: 1,
                scaleYCompressed: 1,
                opacityCompressed: 1,
            },
            negativeX: {
                points: [{x: 0, y: 0}, {x: 15, y: 5}, {x: 15, y: -5}],
                compressedX: -5,
                expandedX: -5,
                compressedY: 0,
                expandedY: 0,
                locatorOriginX: 'left',
                locatorOriginY: 'center',
                objectOriginX: 'right',
                objectOriginY: 'center',
                scaleXCompressed: 0,
                scaleYCompressed: 0,
                opacityCompressed: 0,
            }
        };


    };

    polarLocator.updateBoundLimits = function () {

        var theLocator = this;
        var marksBoundLimits = theLocator.getMarksBoundLimits();

        var maxR = 0;
        var maxRNegativeY = 0;
        theLocator.objects.forEach(function (object, index) {
            if (object.isLocatable) {
                if (object.radialCoordinate > maxR) {
                    maxR = object.radialCoordinate;
                }
                if (object.yCoordinate > 0) {
                    if (object.radialCoordinate > maxRNegativeY) {
                        maxRNegativeY = object.radialCoordinate;
                    }
                }
            }
        });

        theLocator.axesLengthsDescription[0].boundLimit = -maxR;
        theLocator.axesLengthsDescription[1].boundLimit = maxRNegativeY !== 0 ? Math.min(-maxRNegativeY, marksBoundLimits.leftmost) : marksBoundLimits.leftmost;

    };

    polarLocator.createAxesLengthsDescription = function () {
        var theLocator = this;
        var marksBoundLimits = theLocator.getMarksBoundLimits();
        var maxR = 0;
        var maxRNegativeY = 0;
        theLocator.objects.forEach(function (object, index) {
            if (object.isLocatable) {
                if (object.radialCoordinate > maxR) {
                    maxR = object.radialCoordinate;
                }
                if (object.yCoordinate > 0) {
                    if (object.radialCoordinate > maxRNegativeY) {
                        maxRNegativeY = object.radialCoordinate;
                    }
                }
            }
        });
        theLocator.axesLengthsDescription = [{
                name: 'positiveX',
                locatorOriginX: 'right',
                locatorOriginY: 'center',
                limit: 'x',
                arrowDistance: 10,
                boundLimit: -maxR,
                useNegative: false,
                minLength: 100,
            }, {
                name: 'negativeX',
                locatorOriginX: 'left',
                locatorOriginY: 'center',
                limit: 'x',
                arrowDistance: -10,
                boundLimit: maxRNegativeY !== 0 ? Math.min(-maxRNegativeY, marksBoundLimits.leftmost) : marksBoundLimits.leftmost,
                useNegative: true,
                minLength: 15,
            }
        ];
    };

    polarLocator.registerLocatableEvents = function (theLocatable) {

        var theLocator = theLocatable.locator;

        theLocatable.registerListener('selected', function (options) {
            if (!theLocator.isCompressed) {

                // deselecting ALL the locatable objects of the locator
                theLocator.deselectLocatableObjects();

                // selecting this one (essentially, showing its location properties)
                theLocatable.selected = true;
                theLocator.setOpacityOfLocationProperties(theLocatable, 1);

            }
        });

        theLocatable.registerListener('moving', function (options) {

            var theLocator = theLocatable.locator;

            if (theLocator) {

                var locatorCenter = theLocator.getPointByOrigin('center', 'center');

                theLocatable.setCoords && theLocatable.setCoords();
                var targetPosition = theLocatable.getPointByOrigin(theLocatable.anchorX, theLocatable.anchorY);

                // updating the mark's position attributes
                theLocatable.xCoordinate = targetPosition.x - locatorCenter.x;
                theLocatable.yCoordinate = targetPosition.y - locatorCenter.y;

                theLocatable.radialCoordinate = Math.sqrt(theLocatable.xCoordinate * theLocatable.xCoordinate + theLocatable.yCoordinate * theLocatable.yCoordinate);
                theLocatable.angularCoordinate = Math.abs(fabric.util.radiansToDegrees(Math.atan2(-theLocatable.yCoordinate, theLocatable.xCoordinate)));
                if (theLocatable.yCoordinate > 0) {
                    theLocatable.angularCoordinate = 360 - theLocatable.angularCoordinate;
                }

                var markCompressedOptions = theLocator.getStateProperties(theLocatable, false);
                markCompressedOptions.x = theLocatable.xCoordinate;
                markCompressedOptions.y = theLocatable.yCoordinate;

                var markExpandedOptions = theLocator.getStateProperties(theLocatable, true);
                markExpandedOptions.x = theLocatable.xCoordinate;
                markExpandedOptions.y = theLocatable.yCoordinate;

                var angularPropertyCompressedOptions = theLocator.getStateProperties(theLocatable.angularProperty, false);
                angularPropertyCompressedOptions.x = theLocatable.radialCoordinate * Math.cos(fabric.util.degreesToRadians(theLocatable.angularCoordinate / 2));
                angularPropertyCompressedOptions.y = -theLocatable.radialCoordinate * Math.sin(fabric.util.degreesToRadians(theLocatable.angularCoordinate / 2));
                var angularPropertyExpandedOptions = theLocator.getStateProperties(theLocatable.angularProperty, true);
                angularPropertyExpandedOptions.x = theLocatable.radialCoordinate * Math.cos(fabric.util.degreesToRadians(theLocatable.angularCoordinate / 2));
                angularPropertyExpandedOptions.y = -theLocatable.radialCoordinate * Math.sin(fabric.util.degreesToRadians(theLocatable.angularCoordinate / 2));

                var radialPropertyCompressedOptions = theLocator.getStateProperties(theLocatable.radialProperty, false);
                radialPropertyCompressedOptions.x = theLocatable.radialCoordinate;
                var radialPropertyExpandedOptions = theLocator.getStateProperties(theLocatable.radialProperty, true);
                radialPropertyExpandedOptions.x = theLocatable.radialCoordinate;

                if (!theLocatable.locked) {
                    if (theLocatable.radialProperty.value.number !== theLocatable.radialCoordinate) {
                        theLocatable.radialProperty.disconnect(true, false);
                    }
                    if (theLocatable.angularProperty.value.number !== -theLocatable.angularCoordinate) {
                        theLocatable.angularProperty.disconnect(true, false);
                    }
                }
                theLocatable.radialProperty.setValue(createNumberValue({unscaledValue: theLocatable.radialCoordinate}), true, true);
                theLocatable.angularProperty.setValue(createNumberValue({unscaledValue: theLocatable.angularCoordinate}), true, true);

                theLocator.positionObjects();

                theLocator.updateAxesLengths(false, false);
            }
        });
    };

    polarLocator.computeLocatableCoordinates = function (theLocatable) {

        var theLocator = this;
        var locatorCenter = theLocator.getPointByOrigin('center', 'center');
        var targetPosition = theLocatable.getPointByOrigin(theLocatable.anchorX, theLocatable.anchorY);
        var x = targetPosition.x - locatorCenter.x;
        var y = targetPosition.y - locatorCenter.y;

        theLocator.addChild(theLocatable, {
            whenCompressed: {
                x: x,
                y: y,
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                originChild: {originX: theLocatable.anchorX, originY: theLocatable.anchorY},
            },
            whenExpanded: {
                x: x,
                y: y,
                originChild: {originX: theLocatable.anchorX, originY: theLocatable.anchorY},
            }
        });

        theLocatable.locator = theLocator;
        theLocatable.xCoordinate = x;
        theLocatable.yCoordinate = y;
        theLocatable.radialCoordinate = Math.sqrt(x * x + y * y);
        theLocatable.angularCoordinate = Math.abs(fabric.util.radiansToDegrees(Math.atan2(-y, x)));
        if (y > 0) {
            theLocatable.angularCoordinate = 360 - theLocatable.angularCoordinate;
        }

    };

    polarLocator.createLocationProperties = function (object) {

        var theLocator = this;

        var angularProperty = new iVoLVER.model.ValueHolder({
            value: createNumberValue({unscaledValue: object.angularCoordinate}),
            fill: object.fill,
            stroke: object.stroke !== 'transparent' ? object.stroke : 'rgb(63,63,63)',
            name: 'angularCoordinate',
            path: paths.phi.rw,
            locatable: object
        });

        var radialProperty = new iVoLVER.model.ValueHolder({
            value: createNumberValue({unscaledValue: object.radialCoordinate}),
            fill: object.fill,
            stroke: object.stroke !== 'transparent' ? object.stroke : 'rgb(63,63,63)',
            name: 'radialCoordinate',
            path: paths.r.rw,
            locatable: object
        });

        object.locationProperties = new Array();
        object.locationProperties.push(angularProperty);
        object.locationProperties.push(radialProperty);

        object.angularProperty = angularProperty;
        object.radialProperty = radialProperty;

        theLocator.addChild(object.radialProperty, {
            whenCompressed: {
                x: object.radialCoordinate,
                y: 0,
            },
            whenExpanded: {
                x: object.radialCoordinate,
                y: 0,
                opacity: 0
            },
            movable: false
        });

        theLocator.addChild(object.angularProperty, {
            whenCompressed: {
                x: object.radialCoordinate * Math.cos(fabric.util.degreesToRadians(object.angularCoordinate / 2)),
                y: -object.radialCoordinate * Math.sin(fabric.util.degreesToRadians(object.angularCoordinate / 2)),
            },
            whenExpanded: {
                x: object.radialCoordinate * Math.cos(fabric.util.degreesToRadians(object.angularCoordinate / 2)),
                y: -object.radialCoordinate * Math.sin(fabric.util.degreesToRadians(object.angularCoordinate / 2)),
                opacity: 0
            },
            movable: false
        });

        angularProperty.beforeRender = iVoLVER.obj.Mark.beforeRenderCircularVisualProperty;
        radialProperty.beforeRender = iVoLVER.obj.Mark.beforeRenderCircularVisualProperty;

        canvas.add(object.angularProperty);
        canvas.add(object.radialProperty);

        theLocator.subscribe(radialProperty, 'valueSet', function (subscriber, subscribable, eventOptions) {

            var withAnimation = eventOptions.withAnimation;

            var theValue = radialProperty.value;
            var newR = Math.abs(theValue.number);

            var theLocatable = object;
            var oldR = theLocatable.radialCoordinate;

            var radialPropertyCompressedOptions = theLocator.getStateProperties(radialProperty, false);
            var radialPropertyExpandedOptions = theLocator.getStateProperties(radialProperty, true);
            var angularPropertyCompressedOptions = theLocator.getStateProperties(angularProperty, false);
            var angularPropertyExpandedOptions = theLocator.getStateProperties(angularProperty, true);
            var locatableCompressedOptions = theLocator.getStateProperties(theLocatable, false);
            var locatableExpandedOptions = theLocator.getStateProperties(theLocatable, true);

            if (withAnimation) {
                fabric.util.animate({
                    easing: fabric.util.ease.easeOutBack,
                    duration: 500,
                    startValue: 0,
                    endValue: 1,
                    onChange: function (currentValue) {

                        var tempR = iVoLVER.util.computeNormalizedValue(oldR, newR, currentValue);
                        theLocatable.radialCoordinate = tempR;

                        var xCoordinate = tempR * Math.cos(fabric.util.degreesToRadians(theLocatable.angularCoordinate));
                        var yCoordinate = tempR * Math.sin(fabric.util.degreesToRadians(theLocatable.angularCoordinate));

                        radialPropertyCompressedOptions.x = tempR;
                        radialPropertyExpandedOptions.x = tempR;

                        theLocatable.xCoordinate = xCoordinate;
                        theLocatable.yCoordinate = -yCoordinate;

                        locatableCompressedOptions.x = xCoordinate;
                        locatableExpandedOptions.x = xCoordinate;

                        locatableCompressedOptions.y = -yCoordinate;
                        locatableExpandedOptions.y = -yCoordinate;

                        angularPropertyCompressedOptions.x = tempR * Math.cos(fabric.util.degreesToRadians(theLocatable.angularCoordinate / 2));
                        angularPropertyCompressedOptions.y = -tempR * Math.sin(fabric.util.degreesToRadians(theLocatable.angularCoordinate / 2));
                        angularPropertyExpandedOptions.x = tempR * Math.cos(fabric.util.degreesToRadians(theLocatable.angularCoordinate / 2));
                        angularPropertyExpandedOptions.y = -tempR * Math.sin(fabric.util.degreesToRadians(theLocatable.angularCoordinate / 2));

                        theLocator.positionObjects();
                        theLocator.updateAxesLengths(false, false);

                    }
                });
            } else {

                var xCoordinate = newR * Math.cos(fabric.util.degreesToRadians(theLocatable.angularCoordinate));
                var yCoordinate = newR * Math.sin(fabric.util.degreesToRadians(theLocatable.angularCoordinate));

                theLocatable.radialCoordinate = newR;

                radialPropertyCompressedOptions.x = newR;
                radialPropertyExpandedOptions.x = newR;

                theLocatable.xCoordinate = xCoordinate;
                theLocatable.yCoordinate = -yCoordinate;

                locatableCompressedOptions.x = xCoordinate;
                locatableExpandedOptions.x = xCoordinate;

                locatableCompressedOptions.y = -yCoordinate;
                locatableExpandedOptions.y = -yCoordinate;

                angularPropertyCompressedOptions.x = newR * Math.cos(fabric.util.degreesToRadians(theLocatable.angularCoordinate / 2));
                angularPropertyCompressedOptions.y = -newR * Math.sin(fabric.util.degreesToRadians(theLocatable.angularCoordinate / 2));
                angularPropertyExpandedOptions.x = newR * Math.cos(fabric.util.degreesToRadians(theLocatable.angularCoordinate / 2));
                angularPropertyExpandedOptions.y = -newR * Math.sin(fabric.util.degreesToRadians(theLocatable.angularCoordinate / 2));

                theLocator.positionObjects();
                theLocator.updateAxesLengths(false, false);
            }
        });

        theLocator.subscribe(angularProperty, 'valueSet', function (subscriber, subscribable, eventOptions) {

            var withAnimation = eventOptions.withAnimation;

            var theValue = angularProperty.value;
            var newPhi = theValue.number % 360;

            var theLocatable = object;
            var oldPhi = theLocatable.angularCoordinate;



            var angularPropertyCompressedOptions = theLocator.getStateProperties(angularProperty, false);
            var angularPropertyExpandedOptions = theLocator.getStateProperties(angularProperty, true);
            var locatableCompressedOptions = theLocator.getStateProperties(theLocatable, false);
            var locatableExpandedOptions = theLocator.getStateProperties(theLocatable, true);

            if (withAnimation) {
                fabric.util.animate({
                    easing: fabric.util.ease.easeOutBack,
                    duration: 500,
                    startValue: 0,
                    endValue: 1,
                    onChange: function (currentValue) {

                        var tempPhi = iVoLVER.util.computeNormalizedValue(oldPhi, newPhi, currentValue);
                        var xCoordinate = theLocatable.radialCoordinate * Math.cos(fabric.util.degreesToRadians(tempPhi));
                        var yCoordinate = theLocatable.radialCoordinate * Math.sin(fabric.util.degreesToRadians(tempPhi));

                        theLocatable.angularCoordinate = tempPhi;
                        theLocatable.xCoordinate = xCoordinate;
                        theLocatable.yCoordinate = -yCoordinate;

                        locatableCompressedOptions.x = xCoordinate;
                        locatableExpandedOptions.x = xCoordinate;
                        locatableCompressedOptions.y = -yCoordinate;
                        locatableExpandedOptions.y = -yCoordinate;

                        angularPropertyCompressedOptions.x = theLocatable.radialCoordinate * Math.cos(fabric.util.degreesToRadians(tempPhi / 2));
                        angularPropertyCompressedOptions.y = -theLocatable.radialCoordinate * Math.sin(fabric.util.degreesToRadians(tempPhi / 2));
                        angularPropertyExpandedOptions.x = theLocatable.radialCoordinate * Math.cos(fabric.util.degreesToRadians(tempPhi / 2));
                        angularPropertyExpandedOptions.y = -theLocatable.radialCoordinate * Math.sin(fabric.util.degreesToRadians(tempPhi / 2));

                        theLocator.positionObjects();
                        theLocator.updateAxesLengths(false, false);

                    }
                });
            } else {

                var xCoordinate = theLocatable.radialCoordinate * Math.cos(fabric.util.degreesToRadians(newPhi));
                var yCoordinate = theLocatable.radialCoordinate * Math.sin(fabric.util.degreesToRadians(newPhi));

                theLocatable.angularCoordinate = newPhi;

                theLocatable.xCoordinate = xCoordinate;
                theLocatable.yCoordinate = -yCoordinate;

                locatableCompressedOptions.x = xCoordinate;
                locatableExpandedOptions.x = xCoordinate;
                locatableCompressedOptions.y = -yCoordinate;
                locatableExpandedOptions.y = -yCoordinate;

                angularPropertyCompressedOptions.x = theLocatable.radialCoordinate * Math.cos(fabric.util.degreesToRadians(newPhi / 2));
                angularPropertyCompressedOptions.y = -theLocatable.radialCoordinate * Math.sin(fabric.util.degreesToRadians(newPhi / 2));
                angularPropertyExpandedOptions.x = theLocatable.radialCoordinate * Math.cos(fabric.util.degreesToRadians(newPhi / 2));
                angularPropertyExpandedOptions.y = -theLocatable.radialCoordinate * Math.sin(fabric.util.degreesToRadians(newPhi / 2));

                theLocator.positionObjects();
                theLocator.updateAxesLengths(false, false);
            }
        });
    };
    return polarLocator;

};



/* SLIDER */

iVoLVER.model.Slider = fabric.util.createClass(fabric.Rect, {
    initialize: function (options) {
        options || (options = {});

        // the slider is added to the canvas in its compressed state. Then, it expands.
        options.compressing = true;
        options.compressed = true;
        options.width = options.width || (options.compressedProperties && options.compressedProperties.width ? options.compressedProperties.width : 150);
        options.height = options.height || (options.compressedProperties && options.compressedProperties.height ? options.compressedProperties.height : 150);

//        options.width = options.width || (options.expandedProperties && options.expandedProperties.width ? options.expandedProperties.width : 500);
//        options.height = options.height || (options.expandedProperties && options.expandedProperties.height ? options.expandedProperties.height : 150);


        options.fill = options.fill || "rgba(237, 237, 237, 0.5)";
        options.stroke = options.stroke || rgb(51, 51, 51);
        options.strokeWidth = options.strokeWidth || 3;
        options.rx = options.rx || 10;
        options.ry = options.ry || 10;
        options.hasBorder = false;
        options.hasControls = false;
        options.hasRotatingPoint = false;
        options.borderColor = 'transparent';
        options.originX = 'center';
        options.originY = 'center';
        options.lockScalingX = true;
        options.lockScalingY = true;
        options.lockRotation = true;

        this.callSuper('initialize', options);

        var theSlider = this;
        theSlider.initExpandable();
        theSlider.addLimits(0, 360);
        theSlider.addPauseButton();
        theSlider.addPlayButton();
        theSlider.addOutputPort();

        theSlider.computFirstInputValueFunction();



        // Since the slider indeed contains connectable elements, but we do not want it to accept incoming connections.
        // So, the containsConnectable is set to false.
        theSlider.containsConnectable = false;

        theSlider.positionObjects();

        theSlider.registerListener('added', function (options) {
            theSlider.stackElements();
            if (theSlider.animateBirth) {
                theSlider.expand({
                    easing: fabric.util.ease.easeOutBack,
                    duration: 500
                });
            }
        });
    },
    computFirstInputValueFunction: function () {
        // Setting the initial value of the input port according to its location in the function
        var theSlider = this;
        var outputPort = theSlider.outputPort;
        var lowerLimit = theSlider.lowerLimit;
        var upperLimit = theSlider.upperLimit;
        var lowerNumber = lowerLimit.value.number;
        var upperNumber = upperLimit.value.number;
        var outValue = createNumberValue({unscaledValue: lowerNumber + Math.abs(upperNumber - lowerNumber) / 2});
        outputPort.setValue(outValue, false);

//        // console.log("***********************************************************************************************");
//        // console.log(outValue);

    },
    _render: function (ctx) {
        var theSlider = this;
        theSlider.callSuper('_render', ctx);

        ctx.save();
        ctx.fillStyle = "rgba(0,0,0," + theSlider.expansionCoefficient + ")";
        ctx.strokeStyle = "rgba(0,0,0," + theSlider.expansionCoefficient + ")";
        ctx.lineWidth = 2;
        ctx.beginPath();

        var x1 = -(theSlider.width / 2 - 10 - theSlider.lowerLimit.width / 2);
        var x2 = theSlider.width / 2 - 10 - theSlider.upperLimit.width / 2;
        var y1 = -10;
        var y2 = -35;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2, y1);
        ctx.stroke();

        ctx.fillStyle = "rgba(0,0,0," + (1 - theSlider.expansionCoefficient) + ")";
        ctx.font = '12px Helvetica';

        var outputValue = !iVoLVER.util.isUndefined(theSlider.outputPort.value) && !iVoLVER.util.isNull(theSlider.outputPort.value) ? theSlider.outputPort.value.getDisplayableString() : '';
        var lowerValue = !iVoLVER.util.isUndefined(theSlider.lowerLimit.value) && !iVoLVER.util.isNull(theSlider.lowerLimit.value) ? theSlider.lowerLimit.value.getDisplayableString() : '';
        var upperValue = !iVoLVER.util.isUndefined(theSlider.upperLimit.value) && !iVoLVER.util.isNull(theSlider.upperLimit.value) ? theSlider.upperLimit.value.getDisplayableString() : '';

        if (!iVoLVER.util.isNull(outputValue) && !iVoLVER.util.isUndefined(outputValue)) {
            ctx.textAlign = "center";
            ctx.fillText(outputValue, 0, -9);
        }

        if (!iVoLVER.util.isNull(upperValue) && !iVoLVER.util.isUndefined(upperValue)) {
            ctx.textAlign = "center";
            ctx.fillText("[ " + lowerValue + " , " + upperValue + " ]", 0, theSlider.height / 2 - 7);
        }

        ctx.restore();
    },
    applySelectedStyle: function (options) {
        var theSlider = this;
        theSlider.stroke = widget_selected_stroke_color;
        theSlider.strokeDashArray = widget_selected_stroke_dash_array;
    },
    applyDeselectedStyle: function () {
        var theSlider = this;
        theSlider.stroke = rgb(51, 51, 51);
        theSlider.strokeDashArray = [];
    },
    stackElements: function () {
        var theSlider = this;
        bringToFront(theSlider);

        bringToFront(theSlider.outputPort);
        iVoLVER.util.bringConnectorsToFront(theSlider.outputPort);

        bringToFront(theSlider.pauseButton);
        bringToFront(theSlider.playButton);

        theSlider.limits.forEach(function (limit) {
            bringToFront(limit);
            iVoLVER.util.bringConnectorsToFront(limit);
        });
    },
    computeOutputPortRelativeCoordinate: function () {
        var theSlider = this;
        var sliderCenter = theSlider.getPointByOrigin('center', 'center');
        var outputPortCenter = theSlider.outputPort.getPointByOrigin('center', 'center');
        theSlider.outputPort.xCoordinate = outputPortCenter.x - sliderCenter.x;
    },
    positionOutputAtNextPlayablePosition: function () {

        var theSlider = this;

        var theOutputPort = theSlider.outputPort;
        var nextCoordinate = theOutputPort.left + 4;

        if (nextCoordinate > theSlider.upperLimit.getCenterPoint().x) {
            nextCoordinate = theSlider.lowerLimit.getCenterPoint().x;
        }
        theOutputPort.left = nextCoordinate;
        theOutputPort.setCoords && theOutputPort.setCoords();
        theOutputPort.relativeX = theOutputPort.getPointByOrigin('center', 'center').x - theSlider.getPointByOrigin('center', 'center').x;
        updateConnectorsPositions(theOutputPort);

        theSlider.computeOutputPortRelativeCoordinate();

        var outputPortExpandedOptions = theSlider.getStateProperties(theSlider.outputPort, true);
        outputPortExpandedOptions.x = theSlider.outputPort.xCoordinate;
    },
    computeOutput: function (xCoordinate, shouldAnimate) {

        var theSlider = this;
        var theOutputPort = theSlider.outputPort;

        if (iVoLVER.util.isUndefined(xCoordinate) || iVoLVER.util.isNull(xCoordinate)) {
            xCoordinate = theOutputPort.left;
        }

        var lowerValue = theSlider.lowerLimit.value;
        var upperValue = theSlider.upperLimit.value;

        if (lowerValue === null || typeof lowerValue === 'undefined' || upperValue === null || typeof upperValue === 'undefined') {
            return;
        }

        var oldMin = theSlider.lowerLimit.getCenterPoint().x;
        var oldMax = theSlider.upperLimit.getCenterPoint().x;
        var outputValue = null;

        if (lowerValue.isNumberValue) {

            var newMin = lowerValue.number;
            var newMax = upperValue.number;
            var output = changeRange(xCoordinate, oldMin, oldMax, newMin, newMax);
            outputValue = createNumberValue({unscaledValue: output});

        } else if (lowerValue.isColorValue) {

            var samplingDistance = 25;
            var steps = Math.round((oldMax - oldMin) / samplingDistance);
            var interpolatedValues = lowerValue.interpolateTo(upperValue, steps);
            if (interpolatedValues) {
                var outputPos = Math.round((xCoordinate - oldMin) / samplingDistance);
                if (outputPos < 0) {
                    outputPos = 0;
                } else if (outputPos >= interpolatedValues.length) {
                    outputPos = interpolatedValues.length - 1;
                }
                outputValue = interpolatedValues[outputPos];
            }

        } else if (lowerValue.isDurationValue) {

            var newMin = lowerValue.duration.valueOf();
            var newMax = upperValue.duration.valueOf();
            var output = changeRange(xCoordinate, oldMin, oldMax, newMin, newMax);
            outputValue = createDurationValue(moment.duration(output));

        } else if (lowerValue.isDateAndTimeValue) {

            var newMin = lowerValue.moment.valueOf();
            var newMax = upperValue.moment.valueOf();
            var output = changeRange(xCoordinate, oldMin, oldMax, newMin, newMax);
            outputValue = createDateAndTimeValue(moment(output));

        }

        theSlider.outputPort.setValue(outputValue, shouldAnimate);

    },
    setButtonOpacity: function (button, opacity) {
        var theSlider = this;
        button.opacity = opacity;
        var expandedOptions = theSlider.getStateProperties(button, true);
        var compressedOptions = theSlider.getStateProperties(button, false);
        expandedOptions.opacity = opacity;
        compressedOptions.opacity = opacity;
    },
    hideButton: function (button) {
        var theSlider = this;
        theSlider.setButtonOpacity(button, 0);
    },
    showButton: function (button) {
        var theSlider = this;
        theSlider.setButtonOpacity(button, 1);
    },
    play: function () {

        var theSlider = this;
        theSlider.playing = true;

        theSlider.hideButton(theSlider.playButton);
        theSlider.showButton(theSlider.pauseButton);

        theSlider.playButton.evented = false;
        theSlider.pauseButton.evented = true;

        var interval = theSlider.interval || 1000 / 30;
        theSlider.timer = setInterval(function () {
            theSlider.positionOutputAtNextPlayablePosition();
            theSlider.computeOutput(null, false);
        }, interval);
    },
    pause: function () {
        var theSlider = this;

        theSlider.playing = false;

        theSlider.hideButton(theSlider.pauseButton);
        theSlider.showButton(theSlider.playButton);

        theSlider.playButton.evented = true;
        theSlider.pauseButton.evented = false;

        if (theSlider.timer) {
            clearInterval(theSlider.timer);
        }
    },
    addPauseButton: function () {
        var theSlider = this;
        var pauseButton = new fabric.Path(buttons.pause, {
            fill: 'rgb(114,114,114)',
            stroke: 'rgb(54,54,54)',
            strokeWidth: 2,
            hasBorder: false,
            hasControls: false,
            hasRotatingPoint: false,
            borderColor: 'transparent',
            perPixelTargetFind: true
        });
        pauseButton.oldRender = pauseButton._render;
        pauseButton._render = function (ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.arc(0, 0, pauseButton.width / 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            pauseButton.oldRender(ctx);
        };
        theSlider.pauseButton = pauseButton;
        theSlider.addChild(pauseButton, {
            whenCompressed: {
                x: 0,
                y: -20,
                originParent: {originX: 'center', originY: 'bottom'},
                originChild: {originX: 'center', originY: 'bottom'},
                opacity: 1,
                scaleX: 0.85,
                scaleY: 0.85
            },
            whenExpanded: {
                x: 0,
                y: -10,
                originParent: {originX: 'center', originY: 'bottom'},
                originChild: {originX: 'center', originY: 'bottom'},
            },
            movable: false
        });

        canvas.add(pauseButton);
        pauseButton.on('mouseup', function (options) {
            theSlider.pause();
        });
    },
    addPlayButton: function () {
        var theSlider = this;
        var playButton = new fabric.Path(buttons.play, {
            fill: 'rgb(114,114,114)',
            stroke: 'rgb(54,54,54)',
            strokeWidth: 2,
            hasBorder: false,
            hasControls: false,
            hasRotatingPoint: false,
            borderColor: 'transparent',
            perPixelTargetFind: true
        });
        playButton.oldRender = playButton._render;
        playButton._render = function (ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.arc(0, 0, playButton.width / 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            playButton.oldRender(ctx);
        };
        theSlider.playButton = playButton;
        theSlider.addChild(playButton, {
            whenCompressed: {
                x: 0,
                y: -20,
                originParent: {originX: 'center', originY: 'bottom'},
                originChild: {originX: 'center', originY: 'bottom'},
                opacity: 1,
                scaleX: 0.85,
                scaleY: 0.85
            },
            whenExpanded: {
                x: 0,
                y: -10,
                originParent: {originX: 'center', originY: 'bottom'},
                originChild: {originX: 'center', originY: 'bottom'},
            },
            movable: false
        });
        canvas.add(playButton);
        playButton.on('mouseup', function (options) {
            theSlider.play();
        });
    },
    addOutputPort: function () {
//        // console.log("Adding output port");
        var theSlider = this;
        var outputPort = new iVoLVER.model.ValueHolder({
            value: createNumberValue({unscaledValue: 0}),
            showLabel: false,
            locked: false,
            lockMovementY: true,
            lockMovementX: false,
            path: ports.output.vertical.up,
            connectableOptions: {
                allowInConnections: false,
                allowOutConnections: true
            }
        });
        theSlider.outputPort = outputPort;
        theSlider.addChild(outputPort, {
            whenCompressed: {
                x: 0,
                y: outputPort.height / 2,
                originParent: {originX: 'center', originY: 'top'},
                originChild: {originX: 'center', originY: 'center'},
                opacity: 1,
                scaleX: 0.8,
                scaleY: 0.8
            },
            whenExpanded: {
                x: 0,
                y: outputPort.height / 2 + 10,
                originParent: {originX: 'center', originY: 'top'},
                originChild: {originX: 'center', originY: 'center'},
            },
            movable: {
                x: {
                    min: {
                        distance: 0,
                        origin: 'center',
                        reference: {
                            object: theSlider.lowerLimit,
                            origin: 'center',
                        }
                    },
                    max: {
                        distance: 0,
                        origin: 'center',
                        reference: {
                            object: theSlider.upperLimit,
                            origin: 'center',
                        }
                    }
                }
            }
        });
        canvas.add(outputPort);
        outputPort.registerListener('moving', function (options) {
            // checking if this is an actual moving and not a connection
            if (outputPort.moving) {
                theSlider.computeOutputPortRelativeCoordinate();
                var playButtonExpandedOptions = theSlider.getStateProperties(theSlider.outputPort, true);
                playButtonExpandedOptions.x = theSlider.outputPort.xCoordinate;
                theSlider.computeOutput(null, false);

            }
        });
        // the outputPort is a subscriber of the 'valueSet' events trigered by the limits of the slider
        outputPort.subscribe(theSlider.lowerLimit, 'valueSet', function (subscriber, subscribable, eventOptions) {
            var withAnimation = eventOptions.withAnimation;
            theSlider.computeOutput(null, withAnimation);
        });
        outputPort.subscribe(theSlider.upperLimit, 'valueSet', function (subscriber, subscribable, eventOptions) {
            var withAnimation = eventOptions.withAnimation;
            theSlider.computeOutput(null, withAnimation);
        });
    },
    addLimits: function (min, max) {
        var theSlider = this;
        theSlider.limits = new Array();
        var separation = 10;
        var y = 22;
        var lowerLimit = new iVoLVER.model.ValueHolder({
            value: createNumberValue({unscaledValue: min || 0}),
            showLabel: true
        });
        theSlider.limits.push(lowerLimit);
        theSlider.lowerLimit = lowerLimit;

        theSlider.addChild(lowerLimit, {
            whenCompressed: {
                x: 0,
                y: y,
                originParent: {originX: 'center', originY: 'center'},
                originChild: {originX: 'center', originY: 'center'},
            },
            whenExpanded: {
                x: separation,
                y: y,
                originParent: {originX: 'left', originY: 'center'},
                originChild: {originX: 'left', originY: 'center'},
            },
            movable: false
        });

        canvas.add(lowerLimit);

        var upperLimit = new iVoLVER.model.ValueHolder({
            value: createNumberValue({unscaledValue: max || 360}),
            showLabel: true
        });
        theSlider.limits.push(upperLimit);
        theSlider.upperLimit = upperLimit;
        theSlider.addChild(upperLimit, {
            whenCompressed: {
                x: 0,
                y: y,
                originParent: {originX: 'center', originY: 'center'},
                originChild: {originX: 'center', originY: 'center'},
            },
            whenExpanded: {
                x: -separation,
                y: y,
                originParent: {originX: 'right', originY: 'center'},
                originChild: {originX: 'right', originY: 'center'},
            },
            movable: false
        });
        canvas.add(upperLimit);
    }
});
iVoLVER.util.extends(iVoLVER.model.Slider, iVoLVER.model.Expandable); // a labeled rectangle is also an Expandable


/*******************************/
/***** IVOLVER COLLECTIONS *****/
/*******************************/

iVoLVER.obj.Collection = iVoLVER.util.createClass(fabric.Rect, {
    toSVG: function () {
        var theCollection = this;
        var center = theCollection.getCenterPoint();
        var stringPath = buildRoundedRectPath(theCollection.left, theCollection.top, theCollection.getScaledWidth(), theCollection.getScaledHeight(), 25, true, true, false, false);
        var path = new fabric.Path(stringPath, {
            originX: 'center',
            originY: 'center',
            top: center.y,
            left: center.x,
            fill: theCollection.fill,
            stroke: theCollection.stroke,
            strokeWidth: theCollection.strokeWidth,
        });

        var lineSVG = '';
        if (!theCollection.isCompressed) {

            var points = [];
            var top = null;
            var left = null;

            if (theCollection.isHorizontal) {
                var b = -theCollection.width / 2 + theCollection.compressedProperties.width;
                points.push(b);
                points.push(-theCollection.height / 2);
                points.push(b);
                points.push(theCollection.height / 2);
                top = theCollection.getTop() - theCollection.height / 2;
                left = theCollection.getLeft() + theCollection.compressedProperties.width;
            } else {
                var a = -theCollection.height / 2 + theCollection.compressedProperties.height;
                points.push(-theCollection.width / 2);
                points.push(a);
                points.push(theCollection.width / 2);
                points.push(a);
                top = theCollection.getTop() + theCollection.compressedProperties.height;
                left = theCollection.getLeft() - theCollection.width / 2;
            }

            var line = new fabric.Line(points, {
                top: top,
                left: left,
                stroke: theCollection.stroke,
                strokeWidth: theCollection.strokeWidth,
            });

            lineSVG = line.toSVG();

        }

        return path.toSVG() + lineSVG;
    },
    initialize: function (options) {

//        // console.log("options");
//        // console.log(options);

        options || (options = {});
        options.reviver = 'iVoLVER.obj.Collection';
        options.serializable = ['top', 'left', 'originX', 'originY', 'value'];
        options.compressing = true;
        options.compressed = true;
        options.iVoLVERType = 'Collection';
        options.compressedProperties = {width: 74, height: 80};
        options.width = options.compressedProperties.width;
        options.height = options.compressedProperties.height;
        options.perPixelTargetFind = true;
        options.lockScalingX = true;
        options.lockScalingY = true;
        options.lockRotation = true;
        options.opacity = 1;
        options.rx = 25;
        options.ry = options.rx;
        options.fill = options.fill || rgb(226, 227, 227);
        options.stroke = options.stroke || rgb(51, 51, 51);
        options.strokeWidth = 3;
        options.isEmpty = true;
        options.iconScale = 1.25;
        options.originX = options.originX || 'center';
        options.originY = options.originY || 'center';
        this.callSuper('initialize', options);


        var theCollection = this;
        theCollection.initExpandable();
        theCollection.initConnectable({
            allowOutConnections: true,
            allowInConnections: true
        });
        if (options.value) {
            var values = options.value;
            theCollection.setValues(values);
            theCollection.addTypeIcon();
        } else {
            theCollection.isEmpty = true;
        }
        theCollection.registerListener('added', function (options) {
            theCollection.stackElements();
            theCollection.positionObjects();
            if (theCollection.animateBirth) {
                var centerPoint = theCollection.getCenterPoint();
                if (theCollection.icon) {
                    animateBirth(theCollection.icon, false, theCollection.iconScale, theCollection.iconScale);
                }
                animateBirth(theCollection, false, 1, 1);
                setTimeout(function () {
                    if (theCollection.isHorizontal) {
                        theCollection.originX = 'left';
                        theCollection.originY = 'center';
                    } else {
                        theCollection.originX = 'center';
                        theCollection.originY = 'top';
                    }
                    theCollection.setPositionByOrigin(centerPoint, 'center', 'center');
                    theCollection.positionObjects();
                }, 1250);
            } else {
                var centerPoint = theCollection.getCenterPoint();
                if (theCollection.isHorizontal) {
                    theCollection.originX = 'left';
                    theCollection.originY = 'center';
                } else {
                    theCollection.originX = 'center';
                    theCollection.originY = 'top';
                }
                theCollection.setPositionByOrigin(centerPoint, 'center', 'center');
                theCollection.positionObjects();
            }
        });

        theCollection.connectableSetValue = theCollection.setValue;

        // overriding the setValue method of the collection
        theCollection.setValue = function (value, withAnimation, doNotNotifySubscribers, doNotChangeValue) {
            if (value.length > 0) {
                var theCollection = this;
                theCollection.valueHolders = new Array();
                theCollection.value = new Array();
                value.forEach(function (value, index) {
                    theCollection.value.push(value);
                    var valueHolder = new iVoLVER.model.ValueHolder({
                        value: value,
                        destinationCompulsory: false,
                        showLabel: false,
                        showTooltip: true
                    });
                    theCollection.addValueHolder(valueHolder, index);
                });
                theCollection.isEmpty = false;
                theCollection.connectableSetValue(value, withAnimation, doNotNotifySubscribers, doNotChangeValue);
            }
        };

    },
    processDroppedIcon: function (iconID) {
        // TODO: this has to be implemented
        // console.log("Icon dropped on top of this collection: " + iconID);
    },
    getCompressedMassPoint: function () {
        var theCollection = this;
        return theCollection.icon ? theCollection.icon.getCenterPoint() : theCollection.getCenterPoint();
    },
    applySelectedStyle: function (options) {
        var theCollection = this;
        theCollection.stroke = widget_selected_stroke_color;
        theCollection.strokeDashArray = widget_selected_stroke_dash_array;
    },
    applyDeselectedStyle: function () {
        var theCollection = this;
        theCollection.strokeDashArray = [];
        if (theCollection.icon) {
            theCollection.stroke = theCollection.icon.stroke;
        } else {
            theCollection.stroke = rgb(51, 51, 51);
        }
    },
    _render: function (ctx, noTransform) {

        var theCollection = this;
        var rx = this.rx ? Math.min(this.rx, this.width / 2) : 0,
                ry = this.ry ? Math.min(this.ry, this.height / 2) : 0,
                w = this.width,
                h = this.height,
                x = -w / 2,
                y = -h / 2,
                isInPathGroup = this.group && this.group.type === 'path-group',
                isRounded = rx !== 0 || ry !== 0,
                k = 1 - 0.5522847498 /* "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf) */;

        ctx.beginPath();
        ctx.globalAlpha = isInPathGroup ? (ctx.globalAlpha * this.opacity) : this.opacity;
        if (this.transformMatrix && isInPathGroup) {
            ctx.translate(this.width / 2 + this.x, this.height / 2 + this.y);
        }
        if (!this.transformMatrix && isInPathGroup) {
            ctx.translate(-this.group.width / 2 + this.width / 2 + this.x, -this.group.height / 2 + this.height / 2 + this.y);
        }
        ctx.moveTo(x + rx, y);
        ctx.lineTo(x + w - rx, y);
        isRounded && ctx.bezierCurveTo(x + w - k * rx, y, x + w, y + k * ry, x + w, y + ry);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x, y + ry);
        isRounded && ctx.bezierCurveTo(x, y + k * ry, x + k * rx, y, x + rx, y);
        ctx.closePath();
        this._renderFill(ctx);

        ctx.save();
        this._renderStroke(ctx);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        var strokeColor = theCollection.icon ? theCollection.icon.stroke : theCollection.stroke;
        var fabricColor = new fabric.Color(strokeColor);
        var r = getR(fabricColor);
        var g = getG(fabricColor);
        var b = getB(fabricColor);
        ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + ", " + theCollection.expansionCoefficient + ")";
        if (theCollection.isHorizontal) {
            var b = -theCollection.width / 2 + theCollection.compressedProperties.width;
            ctx.moveTo(b, -theCollection.height / 2);
            ctx.lineTo(b, theCollection.height / 2);
        } else {
            var a = -theCollection.height / 2 + theCollection.compressedProperties.height;
            ctx.moveTo(-theCollection.width / 2, a);
            ctx.lineTo(theCollection.width / 2, a);
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    },
    stackElements: function () {
        var theCollection = this;
        bringToFront(theCollection);
        if (theCollection.icon) {
            bringToFront(theCollection.icon);
        }
        if (theCollection.valueHolders) {
            theCollection.valueHolders.forEach(function (valueHolder) {
                bringToFront(valueHolder);
                valueHolder.inConnections.forEach(function (inConnection) {
                    bringToFront(inConnection);
                });
                valueHolder.outConnections.forEach(function (outConnection) {
                    bringToFront(outConnection);
                });
            });
        }
        theCollection.outConnections.forEach(function (outConnection) {
            bringToFront(outConnection);
        });

    },
    addTypeIcon: function () {
        var theCollection = this;
        if (theCollection.valueHolders && theCollection.valueHolders.length > 0) {
            var firstValue = theCollection.valueHolders[0].value;
            var iconName = firstValue.getIconPathName ? firstValue.getIconPathName() : null;
            var stringPath = firstValue.getIconPath ? firstValue.getIconPath() : icons[iconName].path;
            var icon = new fabric.Path(stringPath, {
                originX: 'center',
                originY: 'center',
                strokeWidth: 1.5,
                stroke: firstValue.getStrokeColor ? firstValue.getStrokeColor() : icons[iconName].stroke,
                fill: firstValue.getFillColor ? firstValue.getFillColor() : icons[iconName].fill,
                selectable: false,
                evented: false,
            });
            theCollection.icon = icon;
            theCollection.blinkingElement = icon;
            theCollection.originalStroke = icon.stroke;
            theCollection.stroke = icon.stroke;
            theCollection.iconName = iconName;
            theCollection.dataTypeProposition = getVisualValuePropositionByIconName(iconName);
            theCollection.addChild(icon, {
                whenCompressed: {
                    y: theCollection.compressedProperties.height / 2,
                    x: theCollection.compressedProperties.width / 2,
                    opacity: 1,
                    scaleX: theCollection.iconScale,
                    scaleY: theCollection.iconScale,
                    originParent: {originX: 'left', originY: 'top'},
                    originChild: {originX: 'center', originY: 'center'},
                },
                whenExpanded: {
                    y: theCollection.compressedProperties.height / 2,
                    x: theCollection.compressedProperties.width / 2,
                    scaleX: theCollection.iconScale,
                    scaleY: theCollection.iconScale,
                    originParent: {originX: 'left', originY: 'top'},
                    originChild: {originX: 'center', originY: 'center'},
                }
            });
            canvas.add(icon);
        }
    },
    computeExpandedHeight: function (totalElements) {
        var theCollection = this;
        if (iVoLVER.util.isNull(totalElements) || iVoLVER.util.isUndefined(totalElements)) {
            totalElements = theCollection.valueHolders.length;
        }
        return theCollection.compressedProperties.height + 25 + totalElements * 60;
    },
    computeExpandedWidth: function (totalElements) {
        var theCollection = this;
        if (iVoLVER.util.isNull(totalElements) || iVoLVER.util.isUndefined(totalElements)) {
            totalElements = theCollection.valueHolders.length;
        }
        return theCollection.compressedProperties.width + 25 + totalElements * 60;
    },
    addValueHolder: function (valueHolder, index) {
        var theCollection = this;
        theCollection.valueHolders.push(valueHolder);
        if (theCollection.isHorizontal) {
            theCollection.addChild(valueHolder, {
                whenCompressed: {
                    x: 0,
                    y: 0,
                },
                whenExpanded: {
                    y: 0,
                    x: -(theCollection.compressedProperties.width - 5 + index * 60),
                    originParent: {originX: 'right', originY: 'center'},
                    originChild: {originX: 'left', originY: 'center'},
                },
                movable: false
            });
            if (!theCollection.expandedProperties) {
                theCollection.expandedProperties = {};
            }
            theCollection.expandedProperties.width = theCollection.computeExpandedWidth(theCollection.valueHolders.length);
        } else {
            theCollection.addChild(valueHolder, {
                whenCompressed: {
                    x: 0,
                    y: theCollection.compressedProperties.height / 2,
                    originParent: {originX: 'center', originY: 'top'},
                },
                whenExpanded: {
                    x: 0,
                    y: theCollection.compressedProperties.height + 15 + index * 60,
                    originParent: {originX: 'center', originY: 'top'},
                    originChild: {originX: 'center', originY: 'top'},
                }
            });
            if (!theCollection.expandedProperties) {
                theCollection.expandedProperties = {};
            }
            theCollection.expandedProperties.height = theCollection.computeExpandedHeight(theCollection.valueHolders.length);
        }

        valueHolder.nonSerializable = true;

        canvas.add(valueHolder);
        theCollection.subscribe(valueHolder, 'valueSet', function (subscriber, subscribable, eventOptions) {
            theCollection.value[index] = valueHolder.value;
            theCollection.outConnections.forEach(function (outConnection) {
                outConnection.setValue(theCollection.value, eventOptions.withAnimation);
            });
        });
    },
    addValues: function (values, withAnimation, doNotNotifySubscribers) {

        var theCollection = this;
        var currentValues = theCollection.value;
        var totalValues = currentValues.length;

        var clonedValues = new Array();

        if (values.length > 0) {

            values.forEach(function (value, index) {

                var originalHolder = value.holder;
                var clonedValue = value.clone();
                clonedValues.push(clonedValue);

                var valueHolder = new iVoLVER.model.ValueHolder({
                    value: clonedValue,
                    destinationCompulsory: false,
                    showLabel: false,
                    showTooltip: true
                });

                theCollection.addValueHolder(valueHolder, totalValues + index);

                var connector = new Connector({
                    id: iVoLVER.util.generateID(),
                    source: originalHolder,
                    destination: valueHolder,
                    arrowColor: originalHolder.originalStroke,
                    filledArrow: true,
                    value: value,
                    undirected: false
                });
                originalHolder.outConnections.push(connector);
                valueHolder.inConnections.push(connector);

                canvas.add(connector);

            });

            theCollection.isEmpty = false;

            var newValues = currentValues.concat(clonedValues);
            theCollection.setValue(newValues, withAnimation, doNotNotifySubscribers);

        }

    },
    setValues: function (values, withAnimation, doNotNotifySubscribers) {
        if (values.length > 0) {
            var theCollection = this;
            theCollection.valueHolders = new Array();
            theCollection.value = new Array();
            values.forEach(function (value, index) {
                theCollection.value.push(value);
                var valueHolder = new iVoLVER.model.ValueHolder({
                    value: value,
                    destinationCompulsory: false,
                    showLabel: false,
                    showTooltip: true
                });
                theCollection.addValueHolder(valueHolder, index);
            });
            theCollection.isEmpty = false;
            theCollection.setValue(values, withAnimation, doNotNotifySubscribers);
        }
    },
    getValueAt: function (index) {
        var theCollection = this;
        if (!theCollection.isEmpty) {
            return theCollection.valueHolders[index].value;
        }
    },
    getValueHolderAt: function (index) {
        var theCollection = this;
        if (!theCollection.isEmpty) {
            return theCollection.valueHolders[index];
        }
    },
    getFirstValue: function () {
        var theCollection = this;
        return theCollection.getValueAt(0);
    },
    getLastValue: function () {
        var theCollection = this;
        return this.getValueAt(theCollection.valueHolders.length - 1);
    },
    // the COLLECTION deciding whether or not to accept a new incoming connection
    processConnectionRequest: function (theConnector) {
        var sourceObject = theConnector.source;
        var theCollection = this;
        var connectionAccepted = false;
        var message = null;
        var processedValue = null;
        var incomingValue = theConnector.value;
        if (theCollection.isEmpty) {
            connectionAccepted = true;
        } else {
            var currentFirstValue = theCollection.getFirstValue();
            if ($.isArray(incomingValue)) {
                var newFirstValue = incomingValue[0];
                if (currentFirstValue.getDataType() === newFirstValue.getDataType()) {
                    connectionAccepted = true;
                } else {
                    connectionAccepted = false;
                    message = 'This collection can not contain values of this <b>type</b>!';
                }
            } else {
                if (incomingValue.getDataType() === currentFirstValue.getDataType()) {
                    connectionAccepted = true;
                } else {
                    connectionAccepted = false;
                    message = 'This collection can not contain values of this <b>type</b>!';
                }
            }
        }
        return {
            connectionAccepted: connectionAccepted,
            message: message,
            processedValue: processedValue
        };
    },
    // when a collection ACCEPTS an incoming connection
    acceptConnection: function (theConnector, value) {

        var theCollection = this;
        var incomingValue = theConnector.value;
        var totalCurrentValues = theCollection.valueHolders ? theCollection.valueHolders.length : 0;

        var newValue = value;

        // this could essentially mean that:
        // 1) the entire collection is to be replaced by a new set of values,
        // OR that 2) a new value is going to be added to the collection

        // In any of the above cases, when adding a value, the current state of the collection (whether it is expanded or compressed) needs to be considered

        if (theCollection.isEmpty) {
            // if the collection is empty, the type icon should be added too
            theCollection.value = new Array();
            theCollection.valueHolders = new Array();
            if (iVoLVER.util.isNull(theCollection.expandedProperties) || iVoLVER.util.isUndefined(theCollection.expandedProperties)) {
                theCollection.expandedProperties = {};
            }
            if (theCollection.isHorizontal) {
                theCollection.expandedProperties.width = theCollection.compressedProperties.width;
            } else {
                theCollection.expandedProperties.height = theCollection.compressedProperties.height;
            }
            theCollection.isEmpty = false;
        }

        var isCollectiveValue = $.isArray(newValue);
        if (isCollectiveValue) {

            var oldHeight = theCollection.expandedProperties.height;

            theCollection.addValues(incomingValue);

            var newTotalValues = theCollection.value.length + incomingValue.length;

            var newHeight = theCollection.computeExpandedHeight(newTotalValues);

            var newExpansionCoefficient = oldHeight / newHeight;

//            if (theCollection.isCompressed) {
//
//                theCollection.reCompress(20 / theCollection.expandedProperties.height, {
//                    duration: 200,
//                    easing: fabric.util.ease.easeInBack
//                });
//            } else {
//                // console.log("$$$$$$$$$$ newExpansionCoefficient: " + newExpansionCoefficient);
//                    theCollection.reExpand(newExpansionCoefficient, {
//                        duration: 500,
//                        easing: fabric.util.ease.easeInOutBack
//                    });
//            }

            if (!theCollection.icon) {
                theCollection.addTypeIcon();
            }

            theConnector.contract(true);


        } else { // a single value is being added to the collection

            // determine the change in size the collection should undertake
            var newExpansionCoefficient = null;
            var newSize = totalCurrentValues + 1;
            if (theCollection.isHorizontal) {
                var newWidth = theCollection.computeExpandedWidth(newSize);
                newExpansionCoefficient = newWidth / theCollection.expandedProperties.width;
                theCollection.expandedProperties.width = newWidth;
            } else {
                var newHeight = theCollection.computeExpandedHeight(newSize);
                newExpansionCoefficient = newHeight / theCollection.expandedProperties.height;
                theCollection.expandedProperties.height = newHeight;
            }


            var clonedValue = newValue.clone();

            var newValueHolder = new iVoLVER.model.ValueHolder({
                value: clonedValue,
                destinationCompulsory: false,
                showLabel: false,
                showTooltip: true,
            });

            newValueHolder._addIncomingConnection(theConnector);
            theConnector.target = newValueHolder;

            // a new value holder should be added to the collection
            theCollection.addValueHolder(newValueHolder, newSize - 1);

            if (!theCollection.icon) {
                theCollection.addTypeIcon();
            }

            if (theCollection.isCompressed) {

                theCollection.reCompress(20 / theCollection.expandedProperties.height, {
                    duration: 200,
                    easing: fabric.util.ease.easeInBack
                });

            } else {

                theCollection.reExpand(newExpansionCoefficient, {
                    duration: 500,
                    easing: fabric.util.ease.easeInOutBack
                });
            }

            // this needs to be called here, so that the destination has a top and left coordinates already
            // (both set by the reCompress or reExpand methods)
            theConnector.setDestination(newValueHolder, true);


            var currentValues = theCollection.value;
            var newValues = currentValues.concat([clonedValue]);



            // console.log("*************** theCollection.outConnections: ");
            // console.log(theCollection.outConnections);




            theCollection.setValue(newValues, true, false);


        }
    }
});
iVoLVER.util.extends(iVoLVER.obj.Collection, iVoLVER.model.Connectable);
iVoLVER.util.extends(iVoLVER.obj.Collection, iVoLVER.model.Expandable);
iVoLVER.util.extends(iVoLVER.obj.Collection, iVoLVER.event.Subscriber);

/*********************************/
/****** CONTINUOUS FUNCTION ******/
/*********************************/

iVoLVER.functionCoordinates = {
    linear: function () {
        var XValues = [0, 100];
        var YValues = [0, 100];
        return createFunctionCoordinatesFromValues(XValues, YValues);
    },
    quadratic: function () {
        var XValues = [-10, -9.5, -9, -8.5, -8, -7.5, -7, -6.5, -6, -5.5, -5, -4.5, -4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
        var YValues = [100, 90.25, 81, 72.25, 64, 56.25, 49, 42.25, 36, 30.25, 25, 20.25, 16, 12.25, 9, 6.25, 4, 2.25, 1, 0.25, 0, 0.25, 1, 2.25, 4, 6.25, 9, 12.25, 16, 20.25, 25, 30.25, 36, 42.25, 49, 56.25, 64, 72.25, 81, 90.25, 100];
        return createFunctionCoordinatesFromValues(XValues, YValues);
    },
    cubic: function () {
        var XValues = [-10, -9.5, -9, -8.5, -8, -7.5, -7, -6.5, -6, -5.5, -5, -4.5, -4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
        var YValues = [-1000, -857.375, -729, -614.125, -512, -421.875, -343, -274.625, -216, -166.375, -125, -91.125, -64, -42.875, -27, -15.625, -8, -3.375, -1, -0.125, 0, 0.125, 1, 3.375, 8, 15.625, 27, 42.875, 64, 91.125, 125, 166.375, 216, 274.625, 343, 421.875, 512, 614.125, 729, 857.375, 1000];
        return createFunctionCoordinatesFromValues(XValues, YValues);
    },
    sin: function () {
        var XValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360];
        var YValues = [0, 34.8, 68.4, 100, 128.6, 153.2, 173.2, 188, 197, 200, 197, 188, 173.2, 153.2, 128.6, 100, 68.4, 34.8, 0, -34.8, -68.4, -100, -128.6, -153.2, -173.2, -188, -197, -200, -197, -188, -173.2, -153.2, -128.6, -100, -68.4, -34.8, 0];
        return createFunctionCoordinatesFromValues(XValues, YValues);
    },
    cos: function () {
        var XValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360];
        var YValues = [300, 295.5, 282, 259.8, 229.8, 192.9, 150, 102.6, 52.2, 0, -52.2, -102.6, -150, -192.9, -229.8, -259.8, -282, -295.5, -300, -295.5, -282, -259.8, -229.8, -192.9, -150, -102.6, -52.2, 0, 52.2, 102.6, 150, 192.9, 229.8, 259.8, 282, 295.5, 300];
        return createFunctionCoordinatesFromValues(XValues, YValues);
    },
    log: function () {
        var XValues = [0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
        var YValues = [-2, -1, -0.699, -0.523, -0.398, -0.301, -0.222, -0.155, -0.097, -0.046, 0, 0.301, 0.477, 0.602, 0.699, 0.778, 0.845, 0.903, 0.954, 1, 1.041, 1.079, 1.114, 1.146, 1.176, 1.204, 1.230, 1.255, 1.279, 1.301, 1.398, 1.477, 1.544, 1.602, 1.653, 1.699, 1.740, 1.778, 1.813, 1.845, 1.875, 1.903, 1.929, 1.954, 1.978, 2];
        return createFunctionCoordinatesFromValues(XValues, YValues);
    },
    sqrt: function () {
        var XValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
        var YValues = [0, 1, 1.414213562, 1.732050808, 2, 2.236067977, 2.449489743, 2.645751311, 2.828427125, 3, 3.16227766, 3.872983346, 4.472135955, 5, 5.477225575, 5.916079783, 6.32455532, 6.708203932, 7.071067812, 7.416198487, 7.745966692, 8.062257748, 8.366600265, 8.660254038, 8.94427191, 9.219544457, 9.486832981, 9.746794345, 10];
        return createFunctionCoordinatesFromValues(XValues, YValues);
    }
};

iVoLVER.model.ContinuousFunction = fabric.util.createClass(fabric.Rect, {
    initialize: function (options) {
        options || (options = {});

        options.compressing = true;
        options.compressed = true;
        options.width = options.width || (options.compressedProperties && options.compressedProperties.width ? options.compressedProperties.width : 150);
        options.height = options.height || (options.compressedProperties && options.compressedProperties.height ? options.compressedProperties.height : 150);
        options.fill = options.fill || "rgba(237, 237, 237, 0.5)";
        options.stroke = options.stroke || rgb(86, 86, 86);
        options.strokeWidth = options.strokeWidth || 2;
        options.hasBorder = false;
        options.hasControls = false;
        options.hasRotatingPoint = false;
        options.borderColor = 'transparent';
        options.originX = 'center';
        options.originY = 'center';
        options.lockRotation = true;
        this.callSuper('initialize', options);

        var theContinuousFunction = this;
        theContinuousFunction.initExpandable({
            duration: 650
        });

        theContinuousFunction.addBackground();


        var xs = theContinuousFunction.xCoordinates;
        var ys = theContinuousFunction.yCoordinates;
        var completeCoordinates = xs && ys;
        theContinuousFunction.createPolyline();

//                    theContinuousFunction.addLimits(0, 360, 0, 200);
        theContinuousFunction.addLimits();
        theContinuousFunction.addOutputPort(completeCoordinates);
        theContinuousFunction.addInputPort(completeCoordinates);
        theContinuousFunction.addCollections();
        theContinuousFunction.registerSubscriptions();


        // Since the ContinuousFunction indeed contains connectable elements, but we do not want it to accept incoming connections.
        // So, the containsConnectable is set to false.
        theContinuousFunction.containsConnectable = false;

        theContinuousFunction.registerListener('added', function (options) {
            theContinuousFunction.stackElements();
            theContinuousFunction.computeFirstInputValueFunction();
            theContinuousFunction.expand({
                easing: fabric.util.ease.easeOutBack,
                duration: 500
            });
        });

        theContinuousFunction.registerListener('scaling', function (options) {
            var scaleX = theContinuousFunction.getScaleX();
            var scaleY = theContinuousFunction.getScaleY();
            var scalingDown = scaleX < 1 || scaleY < 1;
            if (scalingDown) {
                theContinuousFunction.scaleX = 1;
                theContinuousFunction.scaleY = 1;
                if (!theContinuousFunction.compressing && !theContinuousFunction.isCompressed) {
                    theContinuousFunction.compress();
                }
            } else {
                var scalingUp = scaleX > 0 || scaleY > 0;
                if (scalingUp) {
                    theContinuousFunction.scaleX = 1;
                    theContinuousFunction.scaleY = 1;
                    if (theContinuousFunction.compressing || theContinuousFunction.isCompressed) {
                        theContinuousFunction.expand();
                    }
                }
            }
        });
    },
    createPolyline: function () {
        var theContinuousFunction = this;
        var xs = theContinuousFunction.xCoordinates;
        var ys = theContinuousFunction.yCoordinates;



        var completeCoordinates = xs && ys;
        if (completeCoordinates) {

            var minLength = Math.min(xs.length, ys.length);

            theContinuousFunction.polyline = new Array();
            for (var index = 0; index < minLength; index++) {
                var xValue = xs[index];
                var yValue = ys[index];
                theContinuousFunction.polyline.push({x: xValue.number, y: yValue.number});
            }


//                        xs.forEach(function (xValue, index) {
//                            var yValue = ys[index];
//                            theContinuousFunction.polyline.push({x: xValue.number, y: yValue.number});
//                        });

        }
    },
    computeFirstInputValueFunction: function () {
        // Setting the initial value of the input port according to its location in the function
        var theContinuousFunction = this;
        var inputPort = theContinuousFunction.inputPort;
        // at the beginning, the input port will always be located at the middle point of the range
        // this is a better strategy than relying in positions as, when added, objects' positions are not very accurate,
        // specially when blinking
        var xLowerLimit = theContinuousFunction.minX;
        var xUpperLimit = theContinuousFunction.maxX;
        var lowerX = xLowerLimit.value.number;
        var upperX = xUpperLimit.value.number;
        inputPort.setValue(createNumberValue({unscaledValue: lowerX + Math.abs(upperX - lowerX) / 2}), false);
    },
    positionInputPort: function (newInput, withAnimation) {
        var theContinuousFunction = this;
        var xLowerLimit = theContinuousFunction.minX;
        var xUpperLimit = theContinuousFunction.maxX;
        var lowerX = xLowerLimit.value.number;
        var upperX = xUpperLimit.value.number;
        var endX = changeRange(newInput, lowerX, upperX, 0, theContinuousFunction.width) - theContinuousFunction.width / 2;
        var inputPortExpandedOptions = theContinuousFunction.getStateProperties(theContinuousFunction.inputPort, true);

        if (withAnimation) {
            var initX = inputPortExpandedOptions.x;
            var easing = fabric.util.ease['easeOutBack'];
            var duration = 500;
            fabric.util.animate({
                duration: duration,
                easing: easing,
                startValue: 0,
                endValue: 1,
                onChange: function (currentValue) {
                    inputPortExpandedOptions.x = iVoLVER.util.computeNormalizedValue(initX, endX, currentValue);
                    theContinuousFunction.positionObject(theContinuousFunction.inputPort);
//                    theContinuousFunction.computeOutputPortRelativeCoordinate();
                }
            });
        } else {
            inputPortExpandedOptions.x = endX;
            theContinuousFunction.positionObject(theContinuousFunction.inputPort);
//            theContinuousFunction.computeOutputPortRelativeCoordinate();
        }
    },
    registerSubscriptions: function () {

        var theContinuousFunction = this;
        var inputPort = theContinuousFunction.inputPort;
        var xCollection = theContinuousFunction.xCollection;
        var yCollection = theContinuousFunction.yCollection;

        theContinuousFunction.subscribe(inputPort, 'valueSet', function (subscriber, subscribable, eventOptions) {
            var withAnimation = eventOptions.withAnimation;
            var value = inputPort.value;
            if (iVoLVER.util.isArray(value)) {
                var collectiveOutput = new Array();
                var inputs = new Array();
                var outputs = new Array();
                value.forEach(function (aValue) {
                    var newInput = aValue.number;
                    inputs.push(newInput);
                    var newOutput = theContinuousFunction.computeOutput(newInput);
                    outputs.push(newOutput);
                    collectiveOutput.push(createNumberValue({unscaledValue: newOutput}));
                });

                var x = theContinuousFunction.minX.value.number + (theContinuousFunction.maxX.value.number - theContinuousFunction.minX.value.number) / 2;
                theContinuousFunction.positionInputPort(x, withAnimation); // the input port is positioned in the middle of the input range

                var y = theContinuousFunction.minY.value.number + (theContinuousFunction.maxY.value.number - theContinuousFunction.minY.value.number) / 2;
                theContinuousFunction.positionOutputPort(y, withAnimation); // the input port is positioned in the middle of the input range

                theContinuousFunction.inputValue = inputs;
                theContinuousFunction.outputValue = outputs;

                theContinuousFunction.outputPort.setValue(collectiveOutput, withAnimation);

            } else {
                var newInput = value.number;
                theContinuousFunction.positionInputPort(newInput, withAnimation);
                var newOutput = theContinuousFunction.computeOutput(newInput);
                theContinuousFunction.positionOutputPort(newOutput, withAnimation);
                theContinuousFunction.outputPort.setValue(createNumberValue({unscaledValue: newOutput}), withAnimation);
            }

        });

        theContinuousFunction.limits.forEach(function (limit) {

            theContinuousFunction.subscribe(limit, 'valueSet', function (subscriber, subscribable, eventOptions) {

                var withAnimation = eventOptions.withAnimation;
                var oldValue = eventOptions.previousValue.number;
                var newValue = limit.value.number;

                // console.log("********** Value change at limit: " + limit.name);
                // console.log("oldValue: " + oldValue);
                // console.log("newValue: " + newValue);

                var currentInput = theContinuousFunction.inputValue;
                var xLowerLimit = theContinuousFunction.minX;
                var xUpperLimit = theContinuousFunction.maxX;
                var newLowerX = xLowerLimit.value.number;
                var newUpperX = xUpperLimit.value.number;

                var oldLowerX = oldValue;
                var oldUpperX = oldValue;

                var newInput = currentInput;

                // if the limits of the x axis are changed, the function's current input has to be recomputed
                if (limit.name === 'minX' || limit.name === 'maxX') {
                    if (limit.name === 'minX') {
                        oldUpperX = newUpperX;
                    } else if (limit.name === 'maxX') {
                        oldLowerX = newLowerX;
                    }
                    newInput = changeRange(currentInput, oldLowerX, oldUpperX, newLowerX, newUpperX);
                }

                inputPort.setValue(createNumberValue({unscaledValue: newInput}), withAnimation);

//                // console.log("newInput: " + newInput);


            });

        });



        theContinuousFunction.subscribe(xCollection, 'valueSet', function (subscriber, subscribable, eventOptions) {
            theContinuousFunction.xCoordinates = xCollection.value;
            // updating the limits associated to this collection
            var f = function (numericValue) {
                return numericValue.number;
            };
            var minX = Math.min.apply(Math, xCollection.value.map(f));
            var maxX = Math.max.apply(Math, xCollection.value.map(f));
            theContinuousFunction.minX.setValue(createNumberValue({unscaledValue: minX}));
            theContinuousFunction.maxX.setValue(createNumberValue({unscaledValue: maxX}));

            theContinuousFunction.createPolyline();

            // console.log("theContinuousFunction.inputValue:");
            // console.log(theContinuousFunction.inputValue);

            theContinuousFunction.createPolyline();
            theContinuousFunction.computeFirstInputValueFunction();

            // console.log("theContinuousFunction.inputValue:");
            // console.log(theContinuousFunction.inputValue);
            // console.log("//////////////**********************/////////////////////");


            theContinuousFunction.positionObjects();

        });


        theContinuousFunction.subscribe(yCollection, 'valueSet', function (subscriber, subscribable, eventOptions) {

            // console.log("The yCollection just got a new value");
            // console.log(yCollection.value);

            var withAnimation = eventOptions.withAnimation;

            theContinuousFunction.yCoordinates = yCollection.value;

            // updating the limits associated to this collection
            var f = function (numericValue) {
                return numericValue.number;
            };
            var minY = Math.min.apply(Math, yCollection.value.map(f));
            var maxY = Math.max.apply(Math, yCollection.value.map(f));
            theContinuousFunction.minY.setValue(createNumberValue({unscaledValue: minY}));
            theContinuousFunction.maxY.setValue(createNumberValue({unscaledValue: maxY}));


            if (!theContinuousFunction.xCoordinates || (theContinuousFunction.yCoordinates.length !== theContinuousFunction.xCoordinates.length)) {
                var xCoordinates = new Array();
                theContinuousFunction.yCoordinates.forEach(function (value, index) {
                    xCoordinates.push(createNumberValue({unscaledValue: index}));
                    theContinuousFunction.xCollection.setValue(xCoordinates);
                });
            }

            theContinuousFunction.createPolyline();

            var theInputPort = theContinuousFunction.inputPort;
            var inputPortExpandedOptions = theContinuousFunction.getStateProperties(theInputPort, true);
            inputPortExpandedOptions.opacity = 1;
            var inputPortCompressedOptions = theContinuousFunction.getStateProperties(theInputPort, false);
            inputPortCompressedOptions.opacity = 1;

            var theOutputPort = theContinuousFunction.outputPort;
            var outputPortExpandedOptions = theContinuousFunction.getStateProperties(theOutputPort, true);
            outputPortExpandedOptions.opacity = 1;
            var outputPortCompressedOptions = theContinuousFunction.getStateProperties(theOutputPort, false);
            outputPortCompressedOptions.opacity = 1;

            // console.log("theContinuousFunction.inputValue:");
            // console.log(theContinuousFunction.inputValue);

            theContinuousFunction.computeFirstInputValueFunction();

            // console.log("theContinuousFunction.inputValue:");
            // console.log(theContinuousFunction.inputValue);

            // console.log("***************************");

            theContinuousFunction.positionObjects();

        });




    },
    _render: function (ctx) {
        var theContinuousFunction = this;
        var triangle = [[3, 0], [-10, -6], [-10, 6]];
        theContinuousFunction.callSuper('_render', ctx);

        ctx.save();
        ctx.fillStyle = "rgba(0,0,0," + theContinuousFunction.expansionCoefficient + ")";
        ctx.strokeStyle = "rgba(0,0,0," + theContinuousFunction.expansionCoefficient + ")";
        ctx.lineWidth = 2;


        // y axis line
        x1 = -(theContinuousFunction.width / 2 + theContinuousFunction.outputPort.width / 2 + 12);
        x2 = -(theContinuousFunction.width / 2 + theContinuousFunction.outputPort.width / 2);
        y1 = -theContinuousFunction.height / 2;
        y2 = theContinuousFunction.height / 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);

        // line to the yCollection
        ctx.moveTo(x2, y1);
        ctx.lineTo(x2, y1 - 30);
        ctx.stroke();

        // arrow head pointing to the yCollection
        drawFilledPolygon(translateShape(rotateShape(triangle, -Math.PI / 2), x2, y1 - 30), ctx);

        if (theContinuousFunction.inputOutOfLimits) {
            ctx.strokeStyle = "rgba(198,46,46," + theContinuousFunction.expansionCoefficient + ")";
        }

        // x axis line
        var x1 = -theContinuousFunction.width / 2;
        var x2 = theContinuousFunction.width / 2;
        var y1 = theContinuousFunction.height / 2 + theContinuousFunction.inputPort.height / 2 + 12;
        var y2 = theContinuousFunction.height / 2 + theContinuousFunction.inputPort.height / 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2, y1);



        // line to the xCollection
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 + 30, y2);
        ctx.stroke();

        // arrow head pointing to the xCollection
        drawFilledPolygon(translateShape(rotateShape(triangle, 0), x2 + 30, y2), ctx);

        ctx.fillStyle = "rgba(0,0,0," + (1 - theContinuousFunction.expansionCoefficient) + ")";
        ctx.font = '12px Helvetica';

        ctx.restore();

        if (theContinuousFunction.xCoordinates && theContinuousFunction.yCoordinates) {
            theContinuousFunction.drawFunctionLine(ctx);
        }

    },
    applySelectedStyle: function (options) {
        var theContinuousFunction = this;
        theContinuousFunction.background.stroke = widget_selected_stroke_color;
        theContinuousFunction.background.strokeDashArray = widget_selected_stroke_dash_array;
    },
    applyDeselectedStyle: function () {
        var theContinuousFunction = this;
        theContinuousFunction.background.stroke = rgb(51, 51, 51);
        theContinuousFunction.background.strokeDashArray = [];
    },
    stackElements: function () {
        var theContinuousFunction = this;

        bringToFront(theContinuousFunction.background);

        bringToFront(theContinuousFunction);

        bringToFront(theContinuousFunction.xCollection);
        iVoLVER.util.bringConnectorsToFront(theContinuousFunction.xCollection);

        bringToFront(theContinuousFunction.yCollection);
        iVoLVER.util.bringConnectorsToFront(theContinuousFunction.yCollection);

        theContinuousFunction.limits.forEach(function (limit) {
            bringToFront(limit);
            iVoLVER.util.bringConnectorsToFront(limit);
        });

        bringToFront(theContinuousFunction.inputPort);
        iVoLVER.util.bringConnectorsToFront(theContinuousFunction.inputPort);

        bringToFront(theContinuousFunction.outputPort);
        iVoLVER.util.bringConnectorsToFront(theContinuousFunction.outputPort);
    },
    computeOutputPortRelativeCoordinate: function () {
        var theContinuousFunction = this;
        var ContinuousFunctionCenter = theContinuousFunction.getPointByOrigin('center', 'center');
        var inputPortCenter = theContinuousFunction.inputPort.getPointByOrigin('center', 'center');
        theContinuousFunction.inputPort.xCoordinate = inputPortCenter.x - ContinuousFunctionCenter.x;
    },
    computeOutput: function (functionInput) {

        var theContinuousFunction = this;

        if (!theContinuousFunction.polyline) {
            return;
        }

        theContinuousFunction.inputValue = functionInput;

//                    // console.log("theContinuousFunction.inputValue: " + theContinuousFunction.inputValue);

        var xLowerLimit = theContinuousFunction.minX;
        var xUpperLimit = theContinuousFunction.maxX;
        var lowerX = xLowerLimit.value.number;
        var upperX = xUpperLimit.value.number;

        theContinuousFunction.inputOutOfLimits = functionInput < lowerX || functionInput > upperX;

        if (theContinuousFunction.inputOutOfLimits) {
            theContinuousFunction.intersection = null;
            theContinuousFunction.outputValue = null;
            return;
        }

        var xs = theContinuousFunction.xCoordinates;
        var ys = theContinuousFunction.yCoordinates;
        var f = function (numericValue) {
            return numericValue.number;
        };

        var minX = 0;
        var maxX = 100;
        var minY = 0;
        var maxY = 100;


        if (xs) {
            minX = Math.min.apply(Math, xs.map(f));
            maxX = Math.max.apply(Math, xs.map(f));
        }

        if (ys) {
            minY = Math.min.apply(Math, ys.map(f));
            maxY = Math.max.apply(Math, ys.map(f));
        }

//                    // console.log("minX: " + minX);
//                    // console.log("maxX: " + maxX);
//                    // console.log("minY: " + minY);
//                    // console.log("maxY: " + maxY);

        var coordinateInput = changeRange(functionInput, lowerX, upperX, minX, maxX);
//                    // console.log("coordinateInput: " + coordinateInput);

        var line = {x1: coordinateInput, x2: coordinateInput, y1: minY, y2: maxY};
        theContinuousFunction.intersection = getPathLineIntersection(theContinuousFunction.polyline, line);

        if (theContinuousFunction.intersection) {
            var outputCoordinate = theContinuousFunction.intersection.y;
            var functionOutput = changeRange(outputCoordinate, minY, maxY, theContinuousFunction.minY.value.number, theContinuousFunction.maxY.value.number);
            theContinuousFunction.outputValue = functionOutput;
            return functionOutput;
        }
    },
    positionOutputPort: function (functionOutput, withAnimation) {
        var theContinuousFunction = this;
        var theOutputPort = theContinuousFunction.outputPort;
        var yCoordinate = changeRange(functionOutput, theContinuousFunction.minY.value.number, theContinuousFunction.maxY.value.number, -theContinuousFunction.expandedProperties.height / 2, theContinuousFunction.expandedProperties.height / 2);
        theOutputPort.yCoordinate = yCoordinate;
        var endY = -yCoordinate;
        var outputPortExpandedOptions = theContinuousFunction.getStateProperties(theOutputPort, true);
        var outputPortExpandedOptions = theContinuousFunction.getStateProperties(theContinuousFunction.outputPort, true);
        if (withAnimation) {
            var initY = outputPortExpandedOptions.y;
            var easing = fabric.util.ease['easeOutBack'];
            var duration = 500;
            fabric.util.animate({
                duration: duration,
                easing: easing,
                startValue: 0,
                endValue: 1,
                onChange: function (currentValue) {
                    outputPortExpandedOptions.y = iVoLVER.util.computeNormalizedValue(initY, endY, currentValue);
                    theContinuousFunction.positionObject(theContinuousFunction.outputPort);
                    theContinuousFunction.computeOutputPortRelativeCoordinate();
                }
            });
        } else {
            outputPortExpandedOptions.y = endY;
            theContinuousFunction.positionObject(theContinuousFunction.outputPort);
            theContinuousFunction.computeOutputPortRelativeCoordinate();
        }
    },
    afterCompressing: function () {
        var theContinuousFunction = this;
//                    theContinuousFunction.outputPort.showLabel = true;
    },
    beforeExpanding: function () {
        var theContinuousFunction = this;
//                    theContinuousFunction.outputPort.showLabel = false;
    },
    addInputPort: function (completeCoordinates) {
        var theContinuousFunction = this;
        var inputPort = new iVoLVER.model.ValueHolder({
            value: createNumberValue({unscaledValue: 0}),
            showLabel: false,
            locked: false,
            lockMovementY: true,
            lockMovementX: false,
            path: ports.input.vertical.up,
            connectableOptions: {
                allowInConnections: true,
                allowOutConnections: true
            }
        });
        theContinuousFunction.inputPort = inputPort;
        theContinuousFunction.addChild(inputPort, {
            whenCompressed: {
                x: -(inputPort.width / 2 + 6),
                y: inputPort.height / 2 + 1,
                originParent: {originX: 'left', originY: 'center'},
                originChild: {originX: 'right', originY: 'center'},
                opacity: completeCoordinates ? 1 : 0,
                scaleX: 1,
                scaleY: 1,
                angle: 90
            }, whenExpanded: {
                x: 0,
                y: 2,
                opacity: completeCoordinates ? 1 : 0,
                originParent: {originX: 'center', originY: 'bottom'},
                originChild: {originX: 'center', originY: 'top'},
            }, movable: {
                x: {
                    min: {
                        distance: 0,
                        origin: 'center',
                        reference: {
                            object: theContinuousFunction.minX,
                            origin: 'center',
                        }
                    },
                    max: {
                        distance: 0,
                        origin: 'center',
                        reference: {
                            object: theContinuousFunction.maxX,
                            origin: 'center',
                        }
                    }
                }
            }
        });
        canvas.add(inputPort);

        inputPort.registerListener('moving', function (options) {
            // checking if this is an actual moving and not a connection
            if (inputPort.moving) {

                var connector = inputPort.inConnections.pop();
                if (connector) {
                    connector.contract();
                }

                theContinuousFunction.computeOutputPortRelativeCoordinate();
                var inputPortExpandedOptions = theContinuousFunction.getStateProperties(theContinuousFunction.inputPort, true);
                inputPortExpandedOptions.x = theContinuousFunction.inputPort.xCoordinate;

                var translatedCoordinate = inputPort.xCoordinate + theContinuousFunction.width / 2;
                var functionInput = changeRange(translatedCoordinate, 0, theContinuousFunction.width, theContinuousFunction.minX.value.number, theContinuousFunction.maxX.value.number);

                inputPort.setValue(createNumberValue({unscaledValue: functionInput}), false);

            }
        });
    },
    addOutputPort: function (completeCoordinates) {
        var theContinuousFunction = this;
        var outputPort = new iVoLVER.model.ValueHolder({
            value: createNumberValue({unscaledValue: 0}),
            showLabel: false,
            path: ports.output.horizontal.left,
            preservePath: true,
            connectableOptions: {
                allowInConnections: false,
                allowOutConnections: true
            }
        });
        theContinuousFunction.outputPort = outputPort;
        theContinuousFunction.addChild(outputPort, {
            whenCompressed: {
                x: 8 + outputPort.width,
                y: 0, // because it's rotated, this is the 0 y-coordinate of the output port
                originParent: {originX: 'right', originY: 'center'},
                originChild: {originX: 'left', originY: 'center'},
                opacity: completeCoordinates ? 1 : 0,
                scaleX: 1,
                scaleY: 1,
                angle: 180
            },
            whenExpanded: {
                x: -3,
                y: 0,
                opacity: completeCoordinates ? 1 : 0,
                originParent: {originX: 'left', originY: 'center'},
                originChild: {originX: 'right', originY: 'center'},
            },
            movable: false
        });
        canvas.add(outputPort);
    },
    drawIntersectionCircleAt: function (ctx, xCoordinate, yCoordinate, textX, textY, collectiveInput) {
        var theContinuousFunction = this;
        ctx.save();
        ctx.fillStyle = rgb(212, 78, 150);
        ctx.strokeStyle = darkenrgb(212, 78, 150);
        if (collectiveInput) {
            ctx.lineWidth = iVoLVER.util.computeNormalizedValue(1, 2, theContinuousFunction.expansionCoefficient);
        } else {
            ctx.lineWidth = iVoLVER.util.computeNormalizedValue(2, 3, theContinuousFunction.expansionCoefficient);
        }
        ctx.beginPath();
        var r = iVoLVER.util.computeNormalizedValue(5, 10, theContinuousFunction.expansionCoefficient);
        ctx.arc(xCoordinate, yCoordinate, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        var dash = iVoLVER.util.computeNormalizedValue(6, 10, theContinuousFunction.expansionCoefficient);

        // vertical dashed line towards the x axis
        ctx.beginPath();
        ctx.moveTo(xCoordinate, yCoordinate + r / 2 + ctx.lineWidth);
        if (collectiveInput) {
            ctx.lineTo(0, theContinuousFunction.height / 2);
        } else {
            ctx.lineTo(xCoordinate, theContinuousFunction.height / 2);
        }
        ctx.setLineDash([dash, dash]);
        ctx.stroke();
        ctx.closePath();

        // horizontal dashed line towards the y axis
        ctx.beginPath();
        ctx.moveTo(xCoordinate - (r / 2 + ctx.lineWidth), yCoordinate);
        if (collectiveInput) {
            ctx.lineTo(-theContinuousFunction.width / 2, 0);
        } else {
            ctx.lineTo(-theContinuousFunction.width / 2, yCoordinate);
        }
        ctx.setLineDash([dash, dash]);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,0.75)';

        if (!iVoLVER.util.isUndefined(textX) && !iVoLVER.util.isUndefined(textY)) {
            var text = "(" + textX + " , " + textY + ")";
            var width = iVoLVER.util.computeNormalizedValue(0, ctx.measureText(text).width + 38, theContinuousFunction.expansionCoefficient);
            var height = iVoLVER.util.computeNormalizedValue(0, 21, theContinuousFunction.expansionCoefficient);
            ctx.fillRect(xCoordinate - width / 2, yCoordinate - 35, width, height);
            var fontSize = iVoLVER.util.computeNormalizedValue(0, 16, theContinuousFunction.expansionCoefficient);
            ctx.font = fontSize + 'px Helvetica';
            ctx.fillStyle = rgb(0, 0, 0);
            ctx.textAlign = "center";
            ctx.fillText(text, xCoordinate, yCoordinate - 20);
        }
        ctx.restore();
    },
    drawValuesAtOutputPorts: function (ctx, textX, textY) {
        var theContinuousFunction = this;
        var width = iVoLVER.util.computeNormalizedValue(0, 46, 1 - theContinuousFunction.expansionCoefficient);
        var height = iVoLVER.util.computeNormalizedValue(0, 18, 1 - theContinuousFunction.expansionCoefficient);
        var fillStyle = 'rgba(255,255,255,' + iVoLVER.util.computeNormalizedValue(0.75, 0, theContinuousFunction.expansionCoefficient) + ')';
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.fillRect(-theContinuousFunction.width / 2 - 35 - width / 2, 45 - 15, width, height);
        ctx.fillRect(theContinuousFunction.width / 2 + 35 - width / 2, 45 - 15, width, height);
        fillStyle = 'rgba(0,0,0,' + iVoLVER.util.computeNormalizedValue(1, 0, theContinuousFunction.expansionCoefficient) + ')';
        ctx.fillStyle = fillStyle;
        var fontSize = iVoLVER.util.computeNormalizedValue(0, 16, 1 - theContinuousFunction.expansionCoefficient);
        ctx.font = fontSize + 'px Helvetica';
        ctx.fillText(textX, -(theContinuousFunction.width / 2 + 35), 45);
        ctx.fillText(textY, theContinuousFunction.width / 2 + 35, 45);
        ctx.restore();
    },
    drawFunctionLine: function (ctx) {

        var theContinuousFunction = this;
        var xs = theContinuousFunction.xCoordinates;
        var ys = theContinuousFunction.yCoordinates;

        var f = function (numericValue) {
            return numericValue.number;
        };

        var minX = Math.min.apply(Math, xs.map(f));
        var maxX = Math.max.apply(Math, xs.map(f));

        var minY = Math.min.apply(Math, ys.map(f));
        var maxY = Math.max.apply(Math, ys.map(f));

        ctx.save();
        ctx.lineWidth = iVoLVER.util.computeNormalizedValue(2.5, 4, theContinuousFunction.expansionCoefficient);
        ctx.strokeStyle = rgb(0, 153, 255);
        var x, y;
        ctx.beginPath();

        var minLength = Math.min(xs.length, ys.length);

        for (var i = 0, len = minLength; i < len; i++) {
            textX = changeRange(xs[i].number, minX, maxX, 0, theContinuousFunction.width) - theContinuousFunction.width / 2;
            textY = changeRange(maxY - ys[i].number, minY, maxY, 0, theContinuousFunction.height) + theContinuousFunction.height / 2 - changeRange(maxY - minY, minY, maxY, 0, theContinuousFunction.height);
            ctx.lineTo(textX, textY);
        }
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();

        if (theContinuousFunction.intersection) {

            var inputValue = theContinuousFunction.inputValue;
            var outputValue = theContinuousFunction.outputValue;




            var xLowerLimit = theContinuousFunction.minX;
            var xUpperLimit = theContinuousFunction.maxX;
            var lowerX = xLowerLimit.value.number;
            var upperX = xUpperLimit.value.number;

            var yLowerLimit = theContinuousFunction.minY;
            var yUpperLimit = theContinuousFunction.maxY;
            var lowerY = yLowerLimit.value.number;
            var upperY = yUpperLimit.value.number;

            if (iVoLVER.util.isArray(inputValue)) {
                inputValue.forEach(function (input, index) {
                    var output = outputValue[index];
                    var xCoordinate = changeRange(input, lowerX, upperX, -theContinuousFunction.width / 2, theContinuousFunction.width / 2)
                    var yCoordinate = -changeRange(output, lowerY, upperY, -theContinuousFunction.height / 2, theContinuousFunction.height / 2);
                    if (!iVoLVER.util.isNull(xCoordinate) && !iVoLVER.util.isUndefined(xCoordinate)) {
                        theContinuousFunction.drawIntersectionCircleAt(ctx, xCoordinate, yCoordinate, undefined, undefined, true);
                    }
                });
            } else {
                var xCoordinate = changeRange(inputValue, lowerX, upperX, -theContinuousFunction.width / 2, theContinuousFunction.width / 2)
                var yCoordinate = -changeRange(outputValue, lowerY, upperY, -theContinuousFunction.height / 2, theContinuousFunction.height / 2);
                var textX = inputValue.toFixed(1);
                var textY = outputValue.toFixed(1);
                if (!iVoLVER.util.isNull(xCoordinate) && !iVoLVER.util.isUndefined(xCoordinate)) {
                    theContinuousFunction.drawIntersectionCircleAt(ctx, xCoordinate, yCoordinate, textX, textY);
                    theContinuousFunction.drawValuesAtOutputPorts(ctx, textX, textY);
                }
            }







        }
    },
    addBackground: function () {
        var theContinuousFunction = this;
        var background = new fabric.Rect({
            originX: 'center',
            originY: 'center',
            rx: 10,
            ry: 10,
            fill: 'rgba(255,255,255,0.5)',
            stroke: rgb(51, 51, 51),
            strokeWidth: 3,
            hasBorder: false,
            hasControls: false,
            hasRotatingPoint: false,
            borderColor: 'transparent',
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            lockMovementX: true,
            lockMovementY: true
        });
        theContinuousFunction.addChild(background, {
            whenCompressed: {
                deltaLeft: -36,
                deltaRight: 36,
                deltaTop: -20,
                deltaBottom: 20,
                scaleY: 1,
                scaleX: 1,
                opacity: 1
            },
            whenExpanded: {
//                        deltaLeft: -115,
//                        deltaRight: 40,
//                        deltaTop: -40,
//                        deltaBottom: 128,
                deltaLeft: -115,
                deltaRight: 115,
                deltaTop: -110,
                deltaBottom: 128,
            }
        });
        theContinuousFunction.background = background;
        var events = ['doubleTap', 'selected', 'deselected'];
        events.forEach(function (event) {
            background.on(event, function (options) {
                theContinuousFunction.fire(event, options);
            });
        });
        canvas.add(background);
    },
    addCollections: function () {
        var theContinuousFunction = this;

        var xCollection = new iVoLVER.model.ValueHolder({
            path: 'M53.1,27.2c0-0.7,0-1.5-0.1-2.2c-0.1-1.7-0.3-3.4-0.8-5c-0.4-1.7-1-3.3-1.8-4.9c-0.7-1.6-1.6-3-2.7-4.5 c-1.1-1.4-2.3-2.7-3.6-3.9s-2.9-2.3-4.4-3.2c-1.5-0.9-3.1-1.6-4.7-2.1c-1.6-0.6-3.3-0.9-5-1.1C28.8,0.1,27.5,0,26.2,0 c-0.4,0-0.9,0-1.3,0.1c-1.7,0.1-3.4,0.3-5,0.8c-1.7,0.4-3.2,1-4.8,1.8c-1.6,0.7-3.1,1.6-4.5,2.7c-1.4,1.1-2.8,2.3-4,3.6 c-1.2,1.4-2.3,2.9-3.1,4.4c-0.9,1.5-1.6,3.1-2.1,4.8c-0.6,1.6-1,3.3-1.2,5C0.1,24.4,0,25.8,0,27.2h0v30.9h53.1L53.1,27.2 L53.1,27.2z M33.7,51.6l-7.1-11.5l-7.1,11.5H7.2L19.5,33L8.3,15.8h12.2l6.3,11l6.2-11H45L33.9,33.2l12.2,18.5H33.7z',
            value: theContinuousFunction.xCoordinates,
            top: 300,
            left: 750,
            allowedTypes: ['number'],
            isCollective: true,
        });
        theContinuousFunction.xCollection = xCollection;

        var yCollection = new iVoLVER.model.ValueHolder({
            path: 'M53,25c-0.1-1.7-0.3-3.4-0.8-5c-0.4-1.7-1-3.3-1.8-4.9c-0.7-1.6-1.6-3-2.7-4.5c-1.1-1.4-2.3-2.7-3.6-3.9 c-1.3-1.2-2.9-2.3-4.4-3.2c-1.5-0.9-3.1-1.6-4.7-2.1c-1.6-0.6-3.3-0.9-5-1.1C28.8,0.1,27.5,0,26.2,0c-0.4,0-0.9,0-1.3,0.1 c-1.7,0.1-3.4,0.3-5,0.8c-1.7,0.4-3.2,1-4.8,1.8c-1.6,0.7-3.1,1.6-4.5,2.7C9.2,6.5,7.8,7.7,6.6,9c-1.2,1.4-2.3,2.9-3.1,4.4 c-0.9,1.5-1.6,3.1-2.1,4.8c-0.6,1.6-1,3.3-1.2,5c-0.1,1.2-0.2,2.6-0.2,4v30.9h53.1V27.2C53.1,26.5,53.1,25.7,53,25z M32.1,36.7v15 H21v-15L7.1,15.9h12.3l7.2,12.1l7.2-12.1H46L32.1,36.7z',
            value: theContinuousFunction.yCoordinates,
            top: 300,
            left: 750,
            allowedTypes: ['number'],
            isCollective: true,
        });
        theContinuousFunction.yCollection = yCollection;

        theContinuousFunction.addChild(xCollection, {
            whenCompressed: {
                x: 0,
                y: theContinuousFunction.inputPort.width / 2,
                originParent: {originX: 'right', originY: 'bottom'},
                originChild: {originX: 'left', originY: 'center'},
            },
            whenExpanded: {
                x: theContinuousFunction.inputPort.width / 2 + 12,
                y: theContinuousFunction.inputPort.width / 2,
                originParent: {originX: 'right', originY: 'bottom'},
                originChild: {originX: 'left', originY: 'center'},
            },
            movable: false
        });
        canvas.add(xCollection);

        theContinuousFunction.addChild(yCollection, {
            whenCompressed: {
                x: -theContinuousFunction.outputPort.width / 2,
                y: 0,
                originParent: {originX: 'left', originY: 'top'},
                originChild: {originX: 'center', originY: 'bottom'},
            },
            whenExpanded: {
                x: -theContinuousFunction.outputPort.width / 2,
                y: -theContinuousFunction.maxY.height / 2 - 12,
                originParent: {originX: 'left', originY: 'top'},
                originChild: {originX: 'center', originY: 'bottom'},
            },
            movable: false
        });
        canvas.add(yCollection);
    },
    addLimits: function (lowerX, upperX, lowerY, upperY) {
        var theContinuousFunction = this;
        var xs = theContinuousFunction.xCoordinates;
        var ys = theContinuousFunction.yCoordinates;

        var minX = 0;
        var maxX = 100;
        var minY = 0;
        var maxY = 100;


        theContinuousFunction.limits = new Array();

        var y = 45;
        var x = -45;

        var f = function (numericValue) {
            return numericValue.number;
        };

        if (xs) {
            minX = Math.min.apply(Math, xs.map(f));
            maxX = Math.max.apply(Math, xs.map(f));
        }

        if (ys) {
            minY = Math.min.apply(Math, ys.map(f));
            maxY = Math.max.apply(Math, ys.map(f));
        }


        var limitsData = [
            {
                name: 'minX',
                value: iVoLVER.util.isNull(lowerX) || iVoLVER.util.isUndefined(lowerX) ? minX : lowerX,
                compressedOptions: {
                    x: 0,
                    y: y,
                    originParent: {originX: 'center', originY: 'bottom'},
                    originChild: {originX: 'center', originY: 'top'}
                },
                expandedOptions: {
                    x: 0,
                    y: y,
                    originParent: {originX: 'left', originY: 'bottom'},
                    originChild: {originX: 'center', originY: 'top'},
                }
            }, {
                name: 'maxX',
                value: iVoLVER.util.isNull(upperX) || iVoLVER.util.isUndefined(upperX) ? maxX : upperX,
                compressedOptions: {
                    x: 0,
                    y: y,
                    originParent: {originX: 'center', originY: 'bottom'},
                    originChild: {originX: 'center', originY: 'top'}
                },
                expandedOptions: {
                    x: 0,
                    y: y,
                    originParent: {originX: 'right', originY: 'bottom'},
                    originChild: {originX: 'center', originY: 'top'},
                }
            }, {
                name: 'minY',
                value: iVoLVER.util.isNull(lowerY) || iVoLVER.util.isUndefined(lowerY) ? minY : lowerY,
                compressedOptions: {
                    x: x,
                    y: 0,
                    originParent: {originX: 'left', originY: 'center'},
                    originChild: {originX: 'center', originY: 'top'}
                },
                expandedOptions: {
                    x: x,
                    y: 0,
                    originParent: {originX: 'left', originY: 'bottom'},
                    originChild: {originX: 'right', originY: 'center'},
                }
            }, {
                name: 'maxY',
                value: iVoLVER.util.isNull(upperY) || iVoLVER.util.isUndefined(upperY) ? maxY : upperY,
                compressedOptions: {
                    x: x,
                    y: 0,
                    originParent: {originX: 'left', originY: 'center'},
                    originChild: {originX: 'center', originY: 'top'}
                },
                expandedOptions: {
                    x: x,
                    y: 0,
                    originParent: {originX: 'left', originY: 'top'},
                    originChild: {originX: 'right', originY: 'center'},
                }
            }
        ];

        limitsData.forEach(function (limitData) {

            var newLimit = new iVoLVER.model.ValueHolder({
                value: createNumberValue({unscaledValue: limitData.value}),
                showLabel: true,
                limitName: limitData.name,
                id: iVoLVER.util.generateID(),
                name: limitData.name
            });
            theContinuousFunction.limits.push(newLimit);
            theContinuousFunction[limitData.name] = newLimit;
            theContinuousFunction.addChild(newLimit, {
                whenCompressed: {
                    x: limitData.compressedOptions.x,
                    y: limitData.compressedOptions.y,
                    originParent: limitData.compressedOptions.originParent,
                    originChild: limitData.compressedOptions.originChild,
                },
                whenExpanded: {
                    x: limitData.expandedOptions.x,
                    y: limitData.expandedOptions.y,
                    originParent: limitData.expandedOptions.originParent,
                    originChild: limitData.expandedOptions.originChild,
                },
                movable: false
            });
            canvas.add(newLimit);
        });
    }
});
iVoLVER.util.extends(iVoLVER.model.ContinuousFunction, iVoLVER.model.Expandable); // a labeled rectangle is also an Expandable
iVoLVER.util.extends(iVoLVER.model.ContinuousFunction, iVoLVER.event.Subscriber);



iVoLVER.serialization = {
    serialize: function (value) {
        var node = null;
        if (iVoLVER.util.isArray(value)) {
            node = iVoLVER.serialization.createXMLElement("array");
            value.forEach(function (item) {
                var itemNode = null;
                if (!iVoLVER.util.isUndefined(item.iVoLVERType) && !iVoLVER.util.isNull(item.iVoLVERType)) {
                    itemNode = iVoLVER.project.toXML(item, 'object');
                } else {
                    itemNode = iVoLVER.serialization.serialize(item);
                }
                if (!iVoLVER.util.isUndefined(itemNode) && !iVoLVER.util.isNull(itemNode)) {
                    node.append(itemNode);
                }
            });
        } else if (iVoLVER.util.isObject(value)) {
            //khugouyhglouiygui
        } else {
            node = iVoLVER.serialization.createXMLElement("primitive");
            iVoLVER.serialization.addAttributeWithValue(node, "value", value);
            iVoLVER.serialization.addAttributeWithValue(node, "type", typeof value);
        }
        return node;
    },
    createXMLElement: function (elementName) {
        var xml = '<' + elementName + '></' + elementName + '>';
        var xmlDoc = $.parseXML(xml);
        var $xml = $(xmlDoc);
        var node = $xml.find(elementName);
        return node;
    },
    addAttributeWithValue: function (node, attributeName, value) {
//        if (!iVoLVER.util.isUndefined(value) && !iVoLVER.util.isNull(value)) {
        node.attr(attributeName, value);
//        }
    }
};


iVoLVER.project = {
    toXML: function (object, type) {
        var node = null;
        var serializableProperties = object.serializable;
        if (!iVoLVER.util.isUndefined(serializableProperties) && !iVoLVER.util.isNull(serializableProperties)) {
            node = iVoLVER.serialization.createXMLElement(type || object.iVoLVERType || object.reviver);
            var reviver = object.reviver;
            if (!iVoLVER.util.isNull(reviver) && !iVoLVER.util.isUndefined(reviver)) {
                iVoLVER.serialization.addAttributeWithValue(node, "reviver", reviver);
            }
            var id = object.id;
            if (!iVoLVER.util.isNull(id) && !iVoLVER.util.isUndefined(id)) {
                iVoLVER.serialization.addAttributeWithValue(node, "id", id);
            }
            serializableProperties.forEach(function (property) {
                var propertyNode = null;
                if (iVoLVER.util.isString(property)) {
                    var value = object[property];
                    if (!iVoLVER.util.isNull(value) && !iVoLVER.util.isUndefined(value)) {
                        if (value.serialize) {
                            propertyNode = value.serialize();
                        } else {
                            propertyNode = iVoLVER.serialization.serialize(value);
                        }
                    } else {
                        propertyNode = iVoLVER.serialization.createXMLElement("primitive"); // this will create a node with no type or value properties
                    }
                } else if (iVoLVER.util.isObject(property)) {
                    var keys = Object.keys(property);
                    var key = keys[0];
                    var realValue = object[key];
                    if (!iVoLVER.util.isNull(realValue) && !iVoLVER.util.isUndefined(realValue)) {
                        propertyNode = iVoLVER.project.toXML(realValue, 'object');
                    }
                    property = key;
                }
                if (propertyNode) {
                    iVoLVER.serialization.addAttributeWithValue(propertyNode, "property", property);
                    node.append(propertyNode);
                }
            });
        }
        return node;
    },
    generateProjectXML: function () {
        var root = iVoLVER.serialization.createXMLElement('iVoLVER_Canvas');
        iVoLVER.serialization.addAttributeWithValue(root, "zoom", canvas.getZoom());
        iVoLVER.serialization.addAttributeWithValue(root, "panX", -canvas.viewportTransform[4]);
        iVoLVER.serialization.addAttributeWithValue(root, "panY", -canvas.viewportTransform[5]);
        iVoLVER.serialization.addAttributeWithValue(root, "connectorsHidden", canvas.connectorsHidden);
        var reversedObjects = new Array();
        // generating the ids of all the elements that are on the canvas
        var cont = 1;

        var theConnectors = new Array();
        var theObjects = new Array();

        canvas.forEachObject(function (object) {
            reversedObjects.push(object);
            if (object.setXmlIDs) {
                cont = object.setXmlIDs(cont);
            }
        });

        reversedObjects = reversedObjects.reverse();


        reversedObjects.forEach(function (object) {
            if (object.iVoLVERType === 'Connector') {
                theConnectors.push(object);
            } else {
                theObjects.push(object);
            }
        });

//        reversedObjects.forEach(function (object) {
//            if (!object.nonSerializable) {
//                var serializedObject = null;
//                if (object.toXML) {
//                    serializedObject = object.toXML(); //  in case the programmer has defined a customized toXML method
//                } else {
//                    serializedObject = iVoLVER.project.toXML(object); // default serialization performed by iVoLVER (will acces the serializable properties of the object)
//                }
//                if (serializedObject) {
//                    root.append(serializedObject);
//                }
//            }
//        });


        theObjects.forEach(function (object) {
            if (!object.nonSerializable) {
                var serializedObject = null;
                if (object.toXML) {
                    serializedObject = object.toXML(); //  in case the programmer has defined a customized toXML method
                } else {
                    serializedObject = iVoLVER.project.toXML(object); // default serialization performed by iVoLVER (will acces the serializable properties of the object)
                }
                if (serializedObject) {
                    root.append(serializedObject);
                }
            }
        });
        theConnectors.forEach(function (object) {
            if (!object.nonSerializable) {
                var serializedObject = null;
                if (object.toXML) {
                    serializedObject = object.toXML(); //  in case the programmer has defined a customized toXML method
                } else {
                    serializedObject = iVoLVER.project.toXML(object); // default serialization performed by iVoLVER (will acces the serializable properties of the object)
                }
                if (serializedObject) {
                    root.append(serializedObject);
                }
            }
        });


        var xmlText = (new XMLSerializer()).serializeToString(root[0]);
        return iVoLVER.project.formatXml(xmlText);
    },
    formatXml: function (xml) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        jQuery.each(xml.split('\r\n'), function (index, node) {
            var indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (node.match(/^<\/\w/)) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }

            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    },
    populatePendingConnections: function (canvasNode) {

        // console.log("%c" + "Populating pending connections dictionary...", "font-weight: bold; font-size: 15px; background: black; color: rgb(244,138,162);");

        var connectorsNodes = canvasNode.children('connector');
        connectorsNodes.each(function () {
            var connectorNode = $(this);

            var fromID = connectorNode.attr('from');
            var toID = connectorNode.attr('to');

            var firstLevelArray = iVoLVER._pendingConnections[fromID];

            if (!firstLevelArray) {
                iVoLVER._pendingConnections[fromID] = new Object();
            }

            iVoLVER._pendingConnections[fromID][toID] = connectorNode;

        });

        // console.log("%c" + "Connections loaded:", "font-weight: bold; font-size: 15px; background: black; color: rgb(244,138,162);");
        // console.log(iVoLVER._pendingConnections);

    },
    createCreationParameters: function (objectNode) {
        var parameters = {};
        var children = objectNode.children();
        children.each(function () {
            var child = $(this);
            var tagName = this.tagName;
            var property = child.attr('property');
            var type = child.attr('type');
            var readValue = child.attr('value');
            if (tagName === "primitive") {
                var value = readValue;
                if (type === 'number') {
                    value = parseFloat(readValue);
                } else if (type === 'boolean') {
                    value = readValue === 'true';
                }
                parameters[property] = value;
            } else if (tagName === "object") {

                var reviver = child.attr('reviver');
                var objectParameters = iVoLVER.project.createCreationParameters(child);

                var reviver = window[reviver];

                var object = null;

//                if (iVoLVER.util.isFunction(reviver)) {
//                    object = reviver(objectParameters);
//                } else {
//                    object = new reviver(objectParameters);
//                }

                // console.log("///////////// objectParameters:");
                // console.log(objectParameters);



                object = reviver(objectParameters);

                // console.log("+++++++++++ object");
                // console.log(object);

                parameters[property] = object;
            } else if (tagName === "array") {

                var array = [];
                var arrayNodes = child.children();
                arrayNodes.each(function (index, element) {

                    // console.log("index:");
                    // console.log(index);

                    // console.log("element:");
                    // console.log(element);

                    var arrayNode = $(element);

                    // console.log("this.tagName: " + this.tagName);

                    var reviver = arrayNode.attr('reviver');
                    var objectParameters = iVoLVER.project.createCreationParameters(arrayNode);
                    var reviver = window[reviver];
                    var object = reviver(objectParameters);

                    // console.log("----------------------------- object");
                    // console.log(object);

                    array.push(object);
                });
                parameters[property] = array;

                parameters.deserealizing = true;

                // console.log(array);

            }
        });
        return parameters;
    },
    processCanvasXMLNode: function (canvasNode) {

        iVoLVER._pendingConnections = new Object();
        iVoLVER._connectableElements = new Object();

        if (iVoLVER.LOG) {
            // console.log("canvasNode:");
            // console.log(canvasNode);
        }

        var currentZoom = canvas.getZoom();
        var currentPanX = -canvas.viewportTransform[4];
        var currentPanY = -canvas.viewportTransform[5];

        var newZoom = Number(canvasNode.attr('zoom'));
        var newPanX = Number(canvasNode.attr('panX'));
        var newPanY = Number(canvasNode.attr('panY'));

        var connectorsHidden = canvasNode.attr('connectorsHidden') === "true";
        canvas.connectorsHidden = connectorsHidden;
        if (connectorsHidden) {
            $('#toggleConnectorsVisibilityActivatorLink').html('<i id="checkConnectorsVisibility" class="icon-check-empty"></i> Show connectors');
        } else {
            $('#toggleConnectorsVisibilityActivatorLink').html('<i id="checkConnectorsVisibility" class="icon-check"></i> Show connectors');
        }

        // All connections should be loaded before anything else so that, as new elements are added,
        // their connect to others objects that are available on the canvas
//        iVoLVER.project.populatePendingConnections(canvasNode);

        var children = canvasNode.children();

        if (iVoLVER.LOG) {
            // console.log("children:");
            // console.log(children);
        }

        var duration = 1300;

        var tempPanX = currentPanX;
        var tempPanY = currentPanY;
        fabric.util.animate({
            startValue: currentPanX,
            endValue: newPanX,
            duration: duration,
            onChange: function (value) {
                tempPanX = value;
            }
        });
        fabric.util.animate({
            startValue: currentPanY,
            endValue: newPanY,
            duration: duration,
            onChange: function (value) {
                tempPanY = value;
            }
        });

        fabric.util.animate({
            startValue: currentZoom,
            endValue: newZoom,
            duration: duration,
            onChange: function (value) {
                canvas.setZoom(value);
                canvas.absolutePan(new fabric.Point(tempPanX, tempPanY));
            },
            onComplete: function () {
                canvas.setZoom(newZoom);
                canvas.absolutePan(new fabric.Point(newPanX, newPanY));
            }
        });

        var marks = new Array();
        var locators = new Array();
        var images = new Array();

        children.each(function () {

            var child = $(this);
            var tagName = this.tagName;

            var reviverName = child.attr('reviver');
            // console.log("*** reviverName");
            // console.log(reviverName);

            if (reviverName.includes(".")) {
                var parts = reviverName.split(".");
                var reviver = window;
                parts.forEach(function (part) {
                    reviver = reviver[part];
                });
            } else {
                reviver = window[reviverName];
            }

            var parameters = iVoLVER.project.createCreationParameters(child);

            // console.log("+++++++++++++++++ parameters +++++++++++++++++");
            // console.log(parameters);

//            // console.log("***************** parameters:");
//            // console.log(parameters);
//
//            // console.log("reviver:");
//            // console.log(reviver);

            var object = null;
            object = new reviver(parameters);
//
//
//
            canvas.add(object);



//            if (tagName === "mark") {
//
//                marks.push(child);
//
//            } else if (tagName === "operator") {
//
//            createOperatorFromXMLNode(child);
//
//            } else if (tagName === "visualValue") {
//
//                createVisualVariableFromXMLNode(child);
//
//            } else if (tagName === "numericFunction") {
//
//                createNumericFunctionFromXMLNode(child);
//
//            } else if (tagName === "numberGenerator") {
//
//                createNumberGeneratorFromXMLNode(child);
//
//            } else if (tagName === "verticalCollection") {
//
//                createVerticalCollectionFromXMLNode(child);
//
//            } else if (tagName === "numericCollectionGenerator") {
//
//                createNumericCollectionGeneratorFromXMLNode(child);
//
//            } else if (tagName === "importedImage") {
//
//                images.push(child);
//
//            } else if (tagName === "extractor") {
//
//                var type = child.attr('type');
//                if (type === SAMPLER_VIXOR) {
//
//                    createColorSamplerFromXMLNode(child);
//
//                } else if (type === TEXT_RECOGNIZER) {
//
//                    createTextRecogniserFromXMLNode(child);
//
//                }
//
//            } else if (tagName === "locator") {
//
//                locators.push(child);
//
//            } else if (tagName === "mapper") {
//
//                createMapperFromXMLNode(child);
//
//            }

        });

//        images.forEach(function (imageNode) {
//            var image = importImageFromXMLNode(imageNode);
//        });
//
//        // console.log("%c" + "All IMAGES loaded and added to the canvas", "background: #0afff9; color: black;");
//
//        locators.forEach(function (locatorNode) {
//            var locator = createLocatorFromXMLNode(locatorNode);
//        });
//
//        marks.forEach(function (markNode) {
//            var mark = createMarkFromXMLNode(markNode);
//        });
//
//        // console.log("%c" + "All COLOR SAMPLERS loaded and added to the canvas", "background: #0afff9; color: black;");
//
//        var totalPendingConnections = getObjectLength(pendingConnections);
//        // console.log("%c" + "There are " + totalPendingConnections + " PENDING connections!", "font-weight: bold; background: #0afff9; color: black;");

    },
    executePendingConnections: function (objectXmlID) {

        // outgoingConnections
        var fromID = objectXmlID;
        var outgoingConnections = pendingConnections[fromID];

        var totalOutgoingConnections = getObjectLength(outgoingConnections);

        if (totalOutgoingConnections > 0) {

            // console.log("%c" + "Total outgoing connections found for object with ID: " + fromID, "background: yellow; color: black;");
            // console.log(totalOutgoingConnections);

            for (var toID in outgoingConnections) {
                var connection = outgoingConnections[toID];
                var success = createConnectorFromXMLNode(connection);
                if (success) {
                    delete outgoingConnections[toID];
                }
            }

            var stillToBeConnected = getObjectLength(outgoingConnections);

            if (stillToBeConnected === 0) {
                // console.log("%c" + "ALL outgoing connections performed for object with ID: " + fromID, "background: yellow; color: black;");
                delete pendingConnections[fromID];
            } else {
                // console.log("%c" + "Still " + stillToBeConnected + " outgoing connections PENDING for object with ID: " + fromID, "background: blue; color: white;");
            }

        } else {
            // console.log("%c" + "There are no outgoing connections for the object with ID: " + fromID, "background: green; color: black;");
        }

        for (var fromID in pendingConnections) {
            var incommingConnections = pendingConnections[fromID];
            for (var toID in incommingConnections) {
                if (toID === objectXmlID) {

                    var connection = incommingConnections[toID];

                    // console.log("%c" + "One INCOMING connection found for object with ID " + objectXmlID + " from object " + fromID, "font-size: 15px; font-weight: bold; background: rgb(113,181,202); color: black;");

                    var success = createConnectorFromXMLNode(connection);

                    if (success) {

                        // console.log("%c" + "One INCOMING connection performed for object with ID " + objectXmlID + " from object " + fromID, "background: yellow; color: black;");

                        delete incommingConnections[toID];

                        // If all the connections of this object has been done already, it should be removed
                        if (getObjectLength(incommingConnections) === 0) {
                            delete pendingConnections[fromID];
                            // console.log("%c" + "ALL outgoing connections performed for object with ID " + fromID + ". Some of them were pending.", "background: rgb(249,0,217); color: white;");
                        }

                    }
                }
            }
        }

        var totalPendingConnections = getObjectLength(pendingConnections);
        if (totalPendingConnections > 0) {
            // console.log("%c" + "There are " + totalPendingConnections + " PENDING connections!", "background: #0afff9; color: black;");
            // console.log("%c" + "Current state of pendingConnections pool:", "background: rgb(255,25,47); color: white;");
            // console.log(pendingConnections);
        } else {
            // console.log("%c" + "All connections done!", "font-size: 20px; font-weight: bold; background: #f2ff75; color: black;");
        }
    },
    openProjectFile: function (fileName) {
        $.get(fileName, function (xmlDoc) {
            var $xml = $(xmlDoc);
            var canvasNode = $xml.find('iVoLVER_Canvas');
            processCanvasXMLNode(canvasNode);
        });
    },
    loadProjectXML: function (XMLString) {
        var xmlDoc = $.parseXML(XMLString);
        var $xml = $(xmlDoc);
        var canvasNode = $xml.find('iVoLVER_Canvas');
        iVoLVER.project.processCanvasXMLNode(canvasNode);
    },
};






// Mapper
iVoLVER.Mapper = fabric.util.createClass(fabric.Rect, {
    initialize: function (options) {
        options || (options = {});
        options.iVoLVERType = 'Mapper';
        options.reviver = 'iVoLVER.Mapper';
        options.serializable = ['left', 'top', 'inValues', 'outValues'];
        options.compressing = true;
        options.compressed = true;
        options.compressedProperties = {
            width: 280,
            height: 120
        };
        options.expandedProperties = {
            width: 280,
            height: 350
        };
        options.width = options.width || (options.compressedProperties && options.compressedProperties.width ? options.compressedProperties.width : 150);
        options.height = options.height || (options.compressedProperties && options.compressedProperties.height ? options.compressedProperties.height : 150);
        options.fill = options.fill || "rgb(204, 204, 204)";
        options.stroke = options.stroke || rgb(45, 45, 45);
        options.strokeWidth = options.strokeWidth || 3;
        options.hasBorder = false;
        options.hasControls = false;
        options.hasRotatingPoint = false;
        options.borderColor = 'transparent';
        options.originX = 'center';
        options.originY = 'top';
        options.lockRotation = true;
        options.rx = 5;
        options.ry = options.rx;
        this.callSuper('initialize', options);
        var theMapper = this;
        theMapper.initExpandable({
            duration: 650
        });
        theMapper.addCollections(options.inValues, options.outValues);
        theMapper.addInputPort(false);
        theMapper.addOutputPort(false);
        theMapper.addArrow();
        theMapper.registerSubscriptions();
        // Since the Mapper indeed contains connectable elements, but we do not want it to accept incoming connections.
        // So, the containsConnectable is set to false.
        theMapper.containsConnectable = false;
        theMapper.registerListener('added', function (options) {
            theMapper.stackElements();
        });
    },
    _render: function (ctx) {
        var theMapper = this;
        theMapper.callSuper('_render', ctx);
        ctx.save();
        ctx.restore();
    },
    applySelectedStyle: function (options) {
        var theMapper = this;
        theMapper.stroke = widget_selected_stroke_color;
        theMapper.strokeDashArray = widget_selected_stroke_dash_array;
    },
    applyDeselectedStyle: function () {
        var theMapper = this;
        theMapper.stroke = rgb(51, 51, 51);
        theMapper.strokeDashArray = [];
    },
    stackElements: function () {
        var theMapper = this;
        bringToFront(theMapper);
        if (theMapper.arrow) {
            bringToFront(theMapper.arrow);
        }
        if (theMapper.inputCollection) {
            theMapper.inputCollection.stackElements();
        }
        if (theMapper.outputCollection) {
            theMapper.outputCollection.stackElements();
        }
        if (theMapper.inputPort) {
            bringToFront(theMapper.inputPort);
            iVoLVER.util.bringConnectorsToFront(theMapper.inputPort);
        }
        if (theMapper.outputPort) {
            bringToFront(theMapper.outputPort);
            iVoLVER.util.bringConnectorsToFront(theMapper.outputPort);
        }
    },
    addArrow: function () {
        var theMapper = this;
        var arrowPath = 'M -57.417458,-9.0291521 -35.051897,-9.0291521 -35.051897,-15.826252 -19.671986,-2.4472043 -35.051897,10.931711 -35.051897,4.1346128 -57.417458,4.1346128 Z';
        var arrow = new fabric.Path(arrowPath, {
            stroke: 'black',
            fill: 'black',
            selectable: false,
            evented: false,
            opacity: 1
        });
        theMapper.arrow = arrow;
        theMapper.addChild(arrow, {
            whenCompressed: {
                x: 0,
                y: 60,
                opacity: 1,
                scaleX: 1,
                scaleY: 1,
                originParent: {originX: 'center', originY: 'top'},
                originChild: {originX: 'center', originY: 'center'}
            },
            whenExpanded: {
                x: 0,
                y: 60,
                originParent: {originX: 'center', originY: 'top'},
                originChild: {originX: 'center', originY: 'center'}
            }
        });
        canvas.add(arrow);
    },
    addInputPort: function (visible) {
        var theMapper = this;
        var inputPort = new iVoLVER.model.ValueHolder({
            showLabel: true,
            drawBackgroundForLabel: true,
            path: ports.input.horizontal.right,
            connectableOptions: {allowInConnections: true, allowOutConnections: true}
        });
        theMapper.inputPort = inputPort;
        theMapper.addChild(inputPort, {
            whenCompressed: {
                x: -1.5,
                y: 0,
                originParent: {originX: 'left', originY: 'center'},
                originChild: {originX: 'center', originY: 'center'},
                opacity: visible ? 1 : 0,
                scaleX: 1,
                scaleY: 1,
            },
            whenExpanded: {
                x: -1.5,
                y: 20 + 80 + inputPort.strokeWidth / 2,
                opacity: visible ? 1 : 0,
                originParent: {originX: 'left', originY: 'top'},
                originChild: {originX: 'center', originY: 'center'},
            },
            movable: {
                x: {
                    min: {
                        distance: 0,
                        origin: 'center',
                        reference: {object: theMapper, origin: 'left'}
                    },
                    max: {
                        distance: 0,
                        origin: 'center',
                        reference: {object: theMapper, origin: 'left'}
                    }
                },
                y: {
                    min: {
                        distance: 80 + 3 - 3 - inputPort.height / 2 + inputPort.strokeWidth / 2,
                        origin: 'top',
                        reference: {object: theMapper.inputCollection, origin: 'top'}
                    },
                    max: {
                        distance: inputPort.height / 2 - inputPort.strokeWidth * 2,
                        origin: 'bottom',
                        reference: {object: theMapper.inputCollection, origin: 'bottom'}
                    }
                }
            }
        });
        canvas.add(inputPort);
        inputPort.registerListener('moving', function (options) {
            // checking if this is an actual moving and not a connection
            if (inputPort.moving) {
                var connector = inputPort.inConnections.pop();
                if (connector) {
                    connector.contract();
                }
                // updating the input port's expanded locations
                var originY = 'top';
                var topMapper = theMapper.getPointByOrigin('center', originY).y;
                var topInputPort = inputPort.getPointByOrigin('center', originY).y;
                var newY = topInputPort - topMapper;
                var inputPortExpandedOptions = theMapper.getStateProperties(inputPort, true);
                inputPortExpandedOptions.y = newY;
                inputPortExpandedOptions.originParent.originY = originY;
                inputPortExpandedOptions.originChild.originY = originY;
                // moving also the output port accordingly
                theMapper.outputPort.top = theMapper.inputPort.top;
                theMapper.outputPort.setCoords && theMapper.outputPort.setCoords();
                // now we need to update the location options for the output port so that its position is kept
                // after compression and/or expansion
                var outputPortExpandedOptions = theMapper.getStateProperties(theMapper.outputPort, true);
                outputPortExpandedOptions.y = newY;
                outputPortExpandedOptions.originParent.originY = originY;
                outputPortExpandedOptions.originChild.originY = originY;
                theMapper.positionObject(theMapper.outputPort);
                theMapper._computeEvaluationLineValue();
                var inputValue = theMapper._computeInteractiveValue(theMapper.inputCollection);
                var outputValue = theMapper._computeInteractiveValue(theMapper.outputCollection);
            }
        });
    },
    _computeInteractiveValue: function (theCollection) {

        var theMapper = this;
        if (!iVoLVER.util.isUndefined(theCollection) && !iVoLVER.util.isNull(theCollection) && !iVoLVER.util.isUndefined(theCollection.valueHolders) && !iVoLVER.util.isNull(theCollection.valueHolders)) {
            var range = theMapper._getInterpolationParameters(theCollection);
            if (range) {

                var lowerValue = range.lower.value;
                var upperValue = range.upper.value;
                var coefficient = range.coefficient;
                // console.log("coefficient: " + coefficient);
                range.lower.fill = generateRandomColor();
                range.upper.fill = generateRandomColor();
            }
        }
    },
    _getInterpolationParameters: function (theCollection) {

        var theMapper = this;
        if (!iVoLVER.util.isUndefined(theCollection) && !iVoLVER.util.isNull(theCollection) && !iVoLVER.util.isUndefined(theCollection.valueHolders) && !iVoLVER.util.isNull(theCollection.valueHolders)) {
//                        var yInputPort = theMapper.getStateProperties(theMapper.inputPort, true).y;
            var yInputPort = theMapper.inputPort.getCenterPoint().y;
            for (var j = 0; j < theCollection.valueHolders.length - 1; j++) {
                var visualValue1 = theCollection.getValueHolderAt(j);
                var visualValue2 = theCollection.getValueHolderAt(j + 1);
                var y1 = visualValue1.getCenterPoint().y;
                var y2 = visualValue2.getCenterPoint().y;
                var diff = y2 - y1;
                var coefficient = 1 - ((y2 - yInputPort) / diff);
                if (yInputPort >= y1 && yInputPort <= y2) {
                    return {lower: visualValue1, upper: visualValue2, coefficient: coefficient};
                }
            }
        }
    },
    _computeEvaluationLineValue: function () {
        var theMapper = this;
        var evaluationLine = theMapper.inputPort.getPointByOrigin('center', 'center').y - theMapper.inputCollection.getPointByOrigin('center', 'top').y;
        theMapper.inputCollection.evaluationLine = evaluationLine;
        theMapper.outputCollection.evaluationLine = evaluationLine;
    },
    addOutputPort: function (visible) {
        var theMapper = this;
        var outputPort = new iVoLVER.model.ValueHolder({
            showLabel: true,
            drawBackgroundForLabel: true,
            path: ports.output.horizontal.right,
            perPixelTargetFind: false,
            connectableOptions: {allowInConnections: false, allowOutConnections: true}
        });
        theMapper.outputPort = outputPort;
        theMapper.addChild(outputPort, {
            whenCompressed: {
                x: 1.5,
                y: 0,
                opacity: visible ? 1 : 0,
                scaleX: 1,
                scaleY: 1,
                originParent: {originX: 'right', originY: 'center'},
                originChild: {originX: 'center', originY: 'center'}
            },
            whenExpanded: {
                x: 1.5,
                y: 20 + 80 + outputPort.strokeWidth / 2,
                opacity: visible ? 1 : 0,
                originParent: {originX: 'right', originY: 'top'},
                originChild: {originX: 'center', originY: 'center'}
            },
            movable: false
        });
        canvas.add(outputPort);
    },
    _buildMovingConstraintsForValueHolder: function (theCollection) {
        var movingConstraints = {
            x: {
                min: {
                    distance: 0,
                    origin: 'center',
                    reference: {object: theCollection, origin: 'center'}
                },
                max: {
                    distance: 0,
                    origin: 'center',
                    reference: {object: theCollection, origin: 'center'}
                }
            },
            y: {
                min: {
                    distance: theCollection.compressedProperties.height + 3,
                    origin: 'top',
                    reference: {object: theCollection, origin: 'top'}
                },
                max: {
                    distance: -3,
                    origin: 'bottom',
                    reference: {object: theCollection, origin: 'bottom'}
                }
            }
        };
        return movingConstraints;
    },
    _updatePortsColors: function () {
        var theMapper = this;
        var inputCollection = theMapper.inputCollection;
        var outputCollection = theMapper.outputCollection;
        var firstInputValue = inputCollection.getFirstValue();
        if (!iVoLVER.util.isUndefined(firstInputValue)) {
            theMapper.inputPort.fill = firstInputValue.getFillColor();
            theMapper.inputPort.stroke = firstInputValue.getStrokeColor();
            theMapper.inputPort.originalStroke = firstInputValue.getStrokeColor();
        }
        var firstOutputValue = outputCollection.getFirstValue();
        if (!iVoLVER.util.isUndefined(firstOutputValue)) {
            theMapper.outputPort.fill = firstOutputValue.getFillColor();
            theMapper.outputPort.stroke = firstOutputValue.getStrokeColor();
            theMapper.outputPort.originalStroke = firstOutputValue.getStrokeColor();
        }
    },
    registerSubscriptions: function () {
        var theMapper = this;
        var inputCollection = theMapper.inputCollection;
        var outputCollection = theMapper.outputCollection;
        function collectionSet(theCollection, thePort) {
            theMapper._updatePortsColors();
            var movingConstraints = theMapper._buildMovingConstraintsForValueHolder(theCollection);
            theCollection.valueHolders.forEach(function (valueHolder) {
                valueHolder.locked = false;
                theCollection.setMovingConstraints(valueHolder, movingConstraints);
                valueHolder.registerListener('moving', function (options) {
                    // updating the value holder's expanded locations
                    var originY = 'top';
                    var topCollection = theCollection.getPointByOrigin('center', originY).y;
                    var topValueHolder = valueHolder.getPointByOrigin('center', originY).y;
                    var newY = topValueHolder - topCollection;
                    var valueHolderExpandedOptions = theCollection.getStateProperties(valueHolder, true);
                    valueHolderExpandedOptions.y = newY;
                    valueHolderExpandedOptions.originParent.originY = originY;
                    valueHolderExpandedOptions.originChild.originY = originY;
                });
            });
            var portCompressedOptions = theMapper.getStateProperties(thePort, false);
            portCompressedOptions.opacity = 1;
            var portExpandedOptions = theMapper.getStateProperties(thePort, true);
            portExpandedOptions.opacity = 1;
            theMapper.positionObject(thePort);
            theMapper.onChangeExpanding = function (value) {
                theMapper._computeEvaluationLineValue();
            };
            if (iVoLVER.util.isUndefined(inputCollection.expandedProperties)) {
                inputCollection.expandedProperties = {};
            }
            if (iVoLVER.util.isUndefined(outputCollection.expandedProperties)) {
                outputCollection.expandedProperties = {};
            }

            // console.log("\n\n");
            var oldInputHeight = inputCollection.expandedProperties.height;
            var oldOutputHeight = outputCollection.expandedProperties.height;
            // console.log("\toldInputHeight: " + oldInputHeight);
            // console.log("\toldOutputHeight: " + oldOutputHeight);
            var oldMinHeight = null;
            var newHeight = null;
            if (iVoLVER.util.isUndefined(oldInputHeight) || iVoLVER.util.isUndefined(oldOutputHeight)) {
                // console.log("\txxxxxxxxxxxxxxxxxxxxxxx");
                newHeight = oldInputHeight || oldOutputHeight;
                oldMinHeight = newHeight;
            } else {
                // console.log("\tyyyyyyyyyyyyyyyyyyyyyyyyyy");
                newHeight = Math.max(oldInputHeight, oldOutputHeight);
                oldMinHeight = Math.min(oldInputHeight, oldOutputHeight);
            }



            // console.log("\toldMinHeight: " + oldMinHeight);
            // console.log("\tnewHeight: " + newHeight);
            var inCoeff = oldInputHeight / newHeight;
            var outCoeff = oldOutputHeight / newHeight;
            // console.log("\tinCoeff: " + inCoeff);
            // console.log("\toutCoeff: " + outCoeff);
            inputCollection.expandedProperties.height = newHeight;
            outputCollection.expandedProperties.height = newHeight;
            // console.log("\tinputCollection.expandedProperties.height: " + inputCollection.expandedProperties.height);
            // console.log("\toutputCollection.expandedProperties.height: " + outputCollection.expandedProperties.height);
            var heightMapper = iVoLVER.util.isUndefined(theMapper.expandedProperties) ? 0 : theMapper.expandedProperties.height;
            var deltaHeight = 40;
            theMapper.expandedProperties.height = newHeight + deltaHeight;
            if (!theMapper.isCompressed) {

                var reExpansionOptions = {duration: 500, easing: fabric.util.ease.easeInOutBack};
                var newExpansionCoefficient = oldMinHeight / newHeight;
                if (theCollection === outputCollection) {
                    if (oldOutputHeight === newHeight) {
                        if (oldOutputHeight > oldInputHeight) {
                            // console.log("--- 111111111111111111111111111111111111");
                            outputCollection.reExpand(newExpansionCoefficient, reExpansionOptions);
                        }
                        if (oldInputHeight !== newHeight) {
                            // console.log("--- 222222222222222222222222222222222222");
                            inputCollection.reExpand(newExpansionCoefficient, reExpansionOptions);
                        }
                    }
                } else {
                    if (oldInputHeight === newHeight) {
                        if (oldInputHeight > oldOutputHeight) {
                            //// console.log("--- 333333333333333333333333333333333333");
                            inputCollection.reExpand(newExpansionCoefficient, reExpansionOptions);
                        }
                        if (oldOutputHeight !== newHeight) {
                            //// console.log("--- 444444444444444444444444444444444444");
                            outputCollection.reExpand(newExpansionCoefficient, reExpansionOptions);
                        }
                    }
                }

                // now, if needed, we re-expand the mapper itself
                var mapperNewExpansionCoefficient = heightMapper / (newHeight + deltaHeight);
                if (mapperNewExpansionCoefficient !== 1) {
                    theMapper.reExpand(mapperNewExpansionCoefficient, reExpansionOptions);
                }
            }
        }
        theMapper.subscribe(inputCollection, 'valueSet', function (subscriber, subscribable) {
            collectionSet(subscribable, theMapper.inputPort);
        });
        theMapper.subscribe(outputCollection, 'valueSet', function (subscriber, subscribable) {
            collectionSet(subscribable, theMapper.outputPort);
        });
    },
    _adjustExpandedProperties: function () {

        // // console.log("%c_adjustExpandedProperties METHOD", "background: red; color: yellow;");
        var theMapper = this;
        var inputCollection = theMapper.inputCollection;
        var outputCollection = theMapper.outputCollection;
        /*// console.log(inputExpandedProperties);
         // console.log(outputExpandedProperties);
         // console.log("inputCollection.expandedProperties:");
         // console.log(inputCollection.expandedProperties);
         // console.log("outputCollection.expandedProperties:");
         // console.log(outputCollection.expandedProperties);*/

        var heightInputCollection = iVoLVER.util.isUndefined(inputCollection.expandedProperties) ? 0 : inputCollection.expandedProperties.height;
        var heightOutputCollection = iVoLVER.util.isUndefined(outputCollection.expandedProperties) ? 0 : outputCollection.expandedProperties.height;
        var heightMapper = iVoLVER.util.isUndefined(theMapper.expandedProperties) ? 0 : theMapper.expandedProperties.height;
        var targetHeight = Math.max(heightInputCollection, heightOutputCollection);
        // // console.log("targetHeight: " + targetHeight);

        var collectionsNewExpansionCoefficient = Math.min(heightInputCollection, heightOutputCollection) / targetHeight;
        var deltaHeight = 40;
        var mapperNewExpansionCoefficient = heightMapper / (targetHeight + deltaHeight);
        /*// console.log("mapperNewExpansionCoefficient: " + mapperNewExpansionCoefficient);
         // console.log("newExpansionCoefficient: " + collectionsNewExpansionCoefficient);*/

        if (!iVoLVER.util.isUndefined(inputCollection.expandedProperties)) {
            inputCollection.expandedProperties.height = targetHeight;
        }
        if (!iVoLVER.util.isUndefined(outputCollection.expandedProperties)) {
            outputCollection.expandedProperties.height = targetHeight;
        }
        theMapper.expandedProperties.height = targetHeight + deltaHeight;
        if (!theMapper.isCompressed) {
            var reExpansionOptions = {duration: 500, easing: fabric.util.ease.easeInOutBack};
            // console.log("heightInputCollection: " + heightInputCollection);
            // console.log("targetHeight: " + targetHeight);
            if (heightInputCollection < targetHeight) {
                // console.log("%%%%%Going to REexpand INPUT collection...");
                inputCollection.reExpand(collectionsNewExpansionCoefficient, reExpansionOptions);
            } else {

                // console.log("......Hello");
                // console.log("heightOutputCollection: " + heightOutputCollection);
                // console.log("heightInputCollection: " + heightInputCollection);
                // console.log("inputCollection.expansionCoefficient: " + inputCollection.expansionCoefficient);
                inputCollection.expansionCoefficient = heightOutputCollection / targetHeight;
                // console.log("inputCollection.expansionCoefficient: " + inputCollection.expansionCoefficient);
                inputCollection.expand();
            }


            if (heightOutputCollection < targetHeight) {
                // console.log("Going to REexpand OUTPUT collection...");
                outputCollection.reExpand(collectionsNewExpansionCoefficient, reExpansionOptions);
            }
            if (mapperNewExpansionCoefficient !== 1) {
                // console.log("Going to REexpand MAPPER collection...");
                theMapper.reExpand(mapperNewExpansionCoefficient, reExpansionOptions);
            }
        }
    },
    _modifyCollectionsRenderMethod: function (theCollection) {
        var oldCollectionRender = theCollection._render;
        theCollection.oldCollectionRender = oldCollectionRender;
        theCollection._render = function (ctx, noTransform) {
            theCollection.oldCollectionRender(ctx, noTransform);
            var evaluationLine = theCollection.evaluationLine;
            var r = getR(theCollection.stroke);
            var g = getG(theCollection.stroke);
            var b = getB(theCollection.stroke);
            if (!iVoLVER.util.isUndefined(evaluationLine) && !iVoLVER.util.isNull(evaluationLine)) {
                ctx.save();
                ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + theCollection.expansionCoefficient + ")";
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 3]);
                ctx.beginPath();
                var y = (-theCollection.height / 2 + evaluationLine) * theCollection.expansionCoefficient;
                ctx.moveTo(-theCollection.width / 2, y);
                ctx.lineTo(theCollection.width / 2, y);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        };
    },
    addCollections: function (inValues, outValues) {
        var theMapper = this;
        var inputCollection = new iVoLVER.obj.Collection({
            fill: 'white',
            originX: 'center',
            originY: 'top',
            value: inValues,
            nonSerializable: true
        });
        theMapper.inputCollection = inputCollection;
        var outputCollection = new iVoLVER.obj.Collection({
            fill: 'white',
            originX: 'center',
            originY: 'top',
            value: outValues,
            nonSerializable: true
        });
        theMapper.outputCollection = outputCollection;
        var deltaX = 75;
        var deltaY = 20;
        theMapper.addChild(inputCollection, {
            whenCompressed: {
                x: deltaX,
                y: deltaY,
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                originParent: {originX: 'left', originY: 'top'},
                originChild: {originX: 'center', originY: 'top'}
            },
            whenExpanded: {
                x: deltaX,
                y: deltaY,
                originParent: {originX: 'left', originY: 'top'},
                originChild: {originX: 'center', originY: 'top'}
            },
            movable: false
        });
        canvas.add(inputCollection);
        theMapper.addChild(outputCollection, {
            whenCompressed: {
                x: -deltaX,
                y: deltaY,
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                originParent: {originX: 'right', originY: 'top'},
                originChild: {originX: 'center', originY: 'top'}
            },
            whenExpanded: {
                x: -deltaX,
                y: deltaY,
                originParent: {originX: 'right', originY: 'top'},
                originChild: {originX: 'center', originY: 'top'}
            },
            movable: false
        });
        canvas.add(outputCollection);
        theMapper._modifyCollectionsRenderMethod(inputCollection);
        theMapper._modifyCollectionsRenderMethod(outputCollection);
    }
});
iVoLVER.util.extends(iVoLVER.Mapper, iVoLVER.model.Expandable);
iVoLVER.util.extends(iVoLVER.Mapper, iVoLVER.event.Subscriber);

//            iVoLVER.util.extends(iVoLVER.Mapper, iVoLVER.model.Expandable);
//            iVoLVER.util.extends(iVoLVER.Mapper, iVoLVER.event.Subscriber);

var oldExpand = iVoLVER.Mapper.prototype.expand;
iVoLVER.Mapper.prototype.expand = function (options) {
    var theMapper = this;
    var inputCollection = theMapper.inputCollection;
    var outputCollection = theMapper.outputCollection;
    if (iVoLVER.util.isUndefined(inputCollection.value) && iVoLVER.util.isUndefined(outputCollection.value)) {
        return;
    }
    theMapper.oldExpand = oldExpand;
    theMapper.oldExpand(options);
    inputCollection.expand(options);
    outputCollection.expand(options);
};
var oldCompress = iVoLVER.Mapper.prototype.compress;
iVoLVER.Mapper.prototype.compress = function (options) {
    var theMapper = this;
    theMapper.oldCompress = oldCompress;
    theMapper.oldCompress(options);
    theMapper.inputCollection.compress(options);
    theMapper.outputCollection.compress(options);
};

//var strings = [
//    createStringValue({string: 'Domingo'}),
//    createStringValue({string: 'Susana'}),
//    createStringValue({string: 'Channy'}),
//    createStringValue({string: 'Gonzalo'}),
//    createStringValue({string: 'Janina'}),
//    createStringValue({string: 'Adriana'}),
//    createStringValue({string: 'Daniel'}),
//];
//
//var aMapper = new iVoLVER.Mapper({
//    left: 850,
//    top: 200,
//    animateBirth: true,
//    inValues: strings,
//    outValues: numbers
//});
//canvas.add(aMapper);