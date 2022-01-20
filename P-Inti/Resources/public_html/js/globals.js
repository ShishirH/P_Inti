var LOG = false;
//var LOG = true;

visualPropertiesNames = {
    shape: 'Shape',
    color: 'Color',
    label: 'Label',
    width: 'Width',
    height: 'Height',
    radius: 'Radius',
    area: 'Area',
    angle: 'Angle',
    rx: 'Rx',
    ry: 'Ry',
    side: 'Side',
    sides: 'Sides',
    magnitude: 'Magnitude',
    xmag: 'MagnitudeX',
    ymag: 'MagnitudeY',
    force: 'Force',
    vector: 'Vector',
    mass: 'Mass',
    velocity: 'Velocity',
    initvelocity: 'InitialVelocity',
    time: 'Time',
    acceleration: 'Acceleration',
    displacement: 'Displacement',
    vectors: 'Vectors',
    magnification: 'Magnification',
    scale: 'Scale',
    name: 'Name',
    value: 'Value',
    input: 'Input',
    output: 'Output',
    interval: 'Interval',
    distance: 'Distance',
    lock: 'Lock'
};

LINE_TEXT_EXTRACTOR = "line";
BLOCK_TEXT_EXTRACTOR = "block";

OPERATOR_TEXT_FILL = "rgb(226, 227, 227)";
DEFAULT_OPERATOR_FILL = "rgb(226, 227, 227)";
DEFAULT_OPERATOR_STROKE = "rgb(0, 0, 0)";

DEFAULT_VISUAL_PROPERTY_FILL = "rgba(153,153,153,1)";
DEFAULT_VISUAL_PROPERTY_STROKE = "rgba(86,86,86,1)";

CDATA_END_REPLACE = 'CDATA_END';
CDATA_END = ']]>';

/* TYPES */

NUMERIC = "Number";
STRING = "String";
DURATION = "Duration";
DATEANDTIME = "DateAndTime";
COLOR = "Color";
SHAPE = "Shape";

HORIZONTAL_RECTANGULAR_OUTPUT = 'Horizontal Rect';
VERTICAL_RECTANGULAR_OUTPUT = 'Vertical Rect';
SQUARED_OUTPUT = 'Square';
CIRCULAR_OUTPUT = 'Circle';
TRIANGULAR_OUTPUT = 'Triangle';
POLYGONAL_OUTPUT = 'Polygon';
MINIATURE_OUTPUT = 'Miniature';

IMAGE_PLOTTER = 'ImagePlotter';


CIRCULAR_MARK = 'Circle';
RECTANGULAR_MARK = 'Rectangle';
SQUARED_MARK = 'Square';
ELLIPTIC_MARK = 'Ellipse';
FATFONT_MARK = 'FatFont';
PATH_MARK = 'Path';
FILLEDPATH_MARK = 'FilledPath';
SVGPATHGROUP_MARK = 'SVGPathGroup';

markShapes = [
    CIRCULAR_MARK,
    RECTANGULAR_MARK,
    SQUARED_MARK,
    ELLIPTIC_MARK,
    FATFONT_MARK,
    PATH_MARK,
    FILLEDPATH_MARK,
    SVGPATHGROUP_MARK,
];


RECTANGULAR_VIXOR = 'RectangleExtractor';
TEXT_RECOGNIZER = 'TextRecognizer';
COLOR_REGION_EXTRACTOR = 'ColorRegionExtractor';
SAMPLER_VIXOR = 'SamplerExtractor';

rectangular_output_default_width = 30;
rectangular_output_default_height = 30;

rectangular_mark_default_width = 65;
rectangular_mark_default_height = 65;


widget_fill_opacity = 0.5;

widget_stroke_color = '#3d3000';
widget_stroke_width = 1.5;
widget_stroke_dash_array = [7, 7];

widget_selected_stroke_color = '#ffce0a';
widget_selected_stroke_width = 3;
widget_selected_stroke_dash_array = [7, 7];

ADDING_NEW_OUTPUT = "ADDING_NEW_OUTPUT";
REPLACING_EXISTING_OUTPUT = "REPLACING_EXISTING_OUTPUT";
DELETING_OUTPUT = "DELETING_OUTPUT";


timeFormats = null;
dateFormats = null;

superScriptsCodes = [
    '&#8304;', // 0
    '&#185;', // 1
    '&#178;', // 2
    '&#179;', // 3
    '&#8308;', // 4
    '&#8309;', // 5
    '&#8310;', // 6
    '&#8311;', // 7
    '&#8312;', // 8
    '&#8313;', // 9
];

//metricPrefixes = [
//    {prefix: 'tera', symbol: 'T', factor: 1000000000000, exponent: 12},
//    {prefix: 'giga', symbol: 'G', factor: 1000000000, exponent: 9},
//    {prefix: 'mega', symbol: 'M', factor: 1000000, exponent: 6},
//    {prefix: '100-kilo', symbol: 'ck', factor: 100000, exponent: 5},
//    {prefix: '10-kilo', symbol: 'dk', factor: 10000, exponent: 4},
//    {prefix: 'kilo', symbol: 'k', factor: 1000, exponent: 3},
//    {prefix: 'hecto', symbol: 'h', factor: 100, exponent: 2},
//    {prefix: 'deca', symbol: 'da', factor: 10, exponent: 1},
//    {prefix: '', symbol: '(none)', factor: 1, exponent: 0},
//    {prefix: 'deci', symbol: 'd', factor: 0.1, exponent: -1},
//    {prefix: 'centi', symbol: 'c', factor: 0.01, exponent: -2},
//    {prefix: 'milli', symbol: 'm', factor: 0.001, exponent: -3},
//    {prefix: 'micro', symbol: 'μ', factor: 0.000001, exponent: -6},
//    {prefix: 'nano', symbol: 'n', factor: 0.000000001, exponent: -9},
//    {prefix: 'pico', symbol: 'p', factor: 0.000000000001, exponent: -12}
//];


metricPrefixes = [
    {text: 'tera' + ' (&#215; 10' + getSuperscriptString(12) + ')', symbol: 'T', factor: 1000000000000, value: 'tera'},
    {text: 'giga' + ' (&#215; 10' + getSuperscriptString(9) + ')', symbol: 'G', factor: 1000000000, value: 'giga'},
    {text: 'mega' + ' (&#215; 10' + getSuperscriptString(6) + ')', symbol: 'M', factor: 1000000, value: 'mega'},
    {text: '100-kilo' + ' (&#215; 10' + getSuperscriptString(5) + ')', symbol: 'ck', factor: 100000, value: '100-kilo'},
    {text: '10-kilo' + ' (&#215; 10' + getSuperscriptString(4) + ')', symbol: 'dk', factor: 10000, value: '10-kilo'},
    {text: 'kilo' + ' (&#215; 10' + getSuperscriptString(3) + ')', symbol: 'k', factor: 1000, value: 'kilo'},
    {text: 'hecto' + ' (&#215; 10' + getSuperscriptString(2) + ')', symbol: 'h', factor: 100, value: 'hecto'},
    {text: 'deca' + ' (&#215; 10)', symbol: 'da', factor: 10, value: 'deca'},
    {text: '', symbol: '', factor: 1, value: ''},
    {text: 'deci' + ' (&#215; 10' + getSuperscriptString(-1) + ')', symbol: 'd', factor: 0.1, value: 'deci'},
    {text: 'centi' + ' (&#215; 10' + getSuperscriptString(-2) + ')', symbol: 'c', factor: 0.01, value: 'centi'},
    {text: 'milli' + ' (&#215; 10' + getSuperscriptString(-3) + ')', symbol: 'm', factor: 0.001, value: 'milli'},
    {text: 'micro' + ' (&#215; 10' + getSuperscriptString(-6) + ')', symbol: 'μ', factor: 0.000001, value: 'micro'},
    {text: 'nano' + ' (&#215; 10' + getSuperscriptString(-9) + ')', symbol: 'n', factor: 0.000000001, value: 'nano'},
    {text: 'pico' + ' (&#215; 10' + getSuperscriptString(-12) + ')', symbol: 'p', factor: 0.000000000001, value: 'pico'}
];

durationOutputOptions = [
    'milliseconds',
    'seconds',
    'minutes',
    'hours',
    'days',
    'months',
    'years'
];

//durationOutputOptions = [
//    {text: 'milliseconds', value: 'milliseconds'},  
//    {text: 'seconds', value: 'seconds'},   
//    {text: 'minutes', value: 'minutes'},   
//    {text: 'hours', value: 'hours'},   
//    {text: 'days', value: 'days'},   
//    {text: 'months', value: 'months'},   
//    {text: 'years', value: 'years'} 
//];

dateAndTimeFormats = [
    'D/MM/YYYY, HH:mm:ss',
    'D/MM/YYYY',
    'HH:mm:ss',
];

durationFormats = [
    'milliseconds',
    'seconds',
    'minutes',
    'hours',
    'days',
    'months',
    'years',
];

months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

durationUnits = [
    'years',
    'months',
    'weeks',
    'days',
    'hours',
    'minutes',
    'seconds',
    'milliseconds'
];


// Path Segment Types (numbers)
PATHSEG_UNKNOWN = 0;
PATHSEG_CLOSEPATH = 1;
PATHSEG_MOVETO_ABS = 2;
PATHSEG_MOVETO_REL = 3;
PATHSEG_LINETO_ABS = 4;
PATHSEG_LINETO_REL = 5;
PATHSEG_CURVETO_CUBIC_ABS = 6;
PATHSEG_CURVETO_CUBIC_REL = 7;
PATHSEG_CURVETO_QUADRATIC_ABS = 8;
PATHSEG_CURVETO_QUADRATIC_REL = 9;
PATHSEG_ARC_ABS = 10;
PATHSEG_ARC_REL = 11;
PATHSEG_LINETO_HORIZONTAL_ABS = 12;
PATHSEG_LINETO_HORIZONTAL_REL = 13;
PATHSEG_LINETO_VERTICAL_ABS = 14;
PATHSEG_LINETO_VERTICAL_REL = 15;
PATHSEG_CURVETO_CUBIC_SMOOTH_ABS = 16;
PATHSEG_CURVETO_CUBIC_SMOOTH_REL = 17;
PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS = 18;
PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL = 19;

linearDimensions = [
    'width',
    'height',
    'radius',
    'rx',
    'ry',
];

var UNDO_CANVAS_ENTRIES = [];
var REDO_CANVAS_ENTRIES = [];

var PERSISTENT_CANVAS_ENTRIES = [];

var OBJECT_WIDGET_FILL = '#DDEBF6';
var SIGNAL_FILL = "#00AFF0"
var SIGNAL_EMITTER_FILL = "#fcc603"
var WHEN_WIDGET_FILL = "#B3CDE3";
var builtInTypes = ["bool", "byte", "sbyte", "char", "decimal", "double", "float", "int", "uint", "nint", "nuint", "long", "ulong", "short", "ushort", "string"];
var colorsArray = ['#FF7F00', '#24A222', '#1776B6', '#E574C3', '#00BED1', '#9564BF'];
var desaturatedColorsArray = ['#ffbf80', '#72a372', '#6d98b5', '#e6a1d1', '#69c8d1', '#a486bf'];
var codeControlsOnCanvas = [];
