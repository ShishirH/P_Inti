using System;
using System.Collections.Generic;
using System.Text;
using System.Globalization;
using System.Diagnostics;

namespace ConsoleApp1 {

    class Logger {

        private static long dt1;
        private static int logIndex = 0;

        private static Stopwatch sw = new Stopwatch();
        public static System.IO.StreamWriter logFile = null;
        public static System.IO.StreamWriter signalFile = null;

        public static Dictionary<string, int> timesCounter = new Dictionary<string, int>();
        public static int getExecutionCount(string key) {
            if (key != null) {
                return timesCounter[key];
            }
            return -1;
        }
        public static void increaseExecutionCount(string key) {
            if (key != null) {
                timesCounter[key]++;
            }
        }

        
        static void init(string fileName) {
            dt1 = nanoTime();
            sw.Start();
            logFile = new System.IO.StreamWriter(System.IO.File.Create(fileName + ".log"));
            logFile.WriteLine("index~symbols~expressions~types~values~line~file~widgetsID~time~column~row~array");

            signalFile = new System.IO.StreamWriter(System.IO.File.Create(fileName + ".signal"));
            signalFile.WriteLine("file~line~widgetsID~time");
        }


        static string getArrayAsString(Array array) {
            StringBuilder builder = new StringBuilder();
            foreach (var value in array) {
                builder.Append(value.ToString());
                builder.Append(';');
            }
            string result = builder.ToString();
            return "[" + result.TrimEnd(';') + "]";
        }

        static string getMatrixAsString (Array matrix) {
            string result = "[";
            if (matrix != null) {
                for (int i = 0; i < matrix.GetLength(0); i++) {
                    string local = "[";
                    for (int j = 0; j < matrix.GetLength(1); j++) {
                        local += matrix.GetValue(i, j).ToString() + ";";
                    }
                    local = local.TrimEnd(';');
                    local += "];";
                    result += local;
                }
                result = result.TrimEnd(';') + "]";
            }
            return result;
        }


        // for variables
        //public static void logAssignment(String logString, object o) {

        //    //file.WriteLine("SIMPLE ASSIGNATION");

        //    bool isArray = o is Array && ((Array)o).Rank == 1;
        //    bool isMatrix = o is Array && ((Array)o).Rank == 2;

        //    //file.WriteLine("isArray: " + isArray);
        //    //file.WriteLine("isMatrix: " + isMatrix);

        //    string valueForFile = o.ToString();

        //    if (isMatrix) {
        //        var array = o as Array;
        //        valueForFile = "[";
        //        if (array != null) {
        //            for (int i = 0; i < array.GetLength(0); i++) {
        //                string local = "[";
        //                for (int j = 0; j < array.GetLength(1); j++) {
        //                    local += array.GetValue(i, j).ToString() + ",";
        //                }
        //                local = local.Substring(0, local.Length - 1);
        //                local += "],";
        //                valueForFile += local;
        //            }
        //            valueForFile = valueForFile.Substring(0, valueForFile.Length - 1);
        //            valueForFile += "]";
        //        }
        //    } else if (isArray) {
        //        var array = o as Array;
        //        valueForFile = getAsString(array);
        //    }

        //    //string newString = (logIndex++) + "~" + logString + "~" + nanoTime();
        //    string newString = (logIndex++) + "~" + logString + "~" + (nanoTime() - dt1);
        //    StringBuilder sb = new StringBuilder();

        //    //file.WriteLine("valueForFile: " + valueForFile);
        //    //file.WriteLine("logString: " + logString);

        //    sb.AppendFormat(newString, valueForFile);
        //    logFile.WriteLine(sb.ToString());
        //}

        //// for 1D-arrays
        //public static void logAssignment(String logString, object o1, object o2) {
        //    logFile.WriteLine("MODIFYING A 1D ARRAY");
        //    string newString = (logIndex++) + "~" + logString + "~" + nanoTime() + "~{1}";
        //    StringBuilder sb = new StringBuilder();
        //    sb.AppendFormat(newString, o1, o2);
        //    logFile.WriteLine(sb.ToString());
        //}

        //// for 2D-arrays
        //public static void logAssignment(String logString, object o1, object o2, object o3) {
        //    logFile.WriteLine("MODIFYING A 2D ARRAY");
        //    string newString = (logIndex++) + "~" + logString + "~" + nanoTime() + "~{1}~{2}";
        //    StringBuilder sb = new StringBuilder();
        //    sb.AppendFormat(newString, o1, o2, o3);
        //    logFile.WriteLine(sb.ToString());
        //}

        public static bool is2DArray(object o) {
            return o is Array && ((Array)o).Rank == 2;
        }

        public static bool is1DArray(object o) {
            return o is Array && ((Array)o).Rank == 1;
        }


        // for any assignment
        public static void logAssignment(String logString, params object[] parentExpressions) {

            string stringForFile = "";
            string row = "", column = "", arrayElementValue = "";
            string values = "";
            List<string> parameters = new List<string>();

            object parameter = parentExpressions[0];
            bool isMatrix = is2DArray(parameter);
            bool isArray = is1DArray(parameter);

            if ((isMatrix || isArray) && parentExpressions.Length == 3) {

                values += "{0}";

                arrayElementValue = parentExpressions[1].ToString();
                column = parentExpressions[2].ToString();

                if (isMatrix) {                                        
                    row = parentExpressions[3].ToString();
                    stringForFile = getMatrixAsString(parameter as Array);

                } else if (isArray) {                    

                    stringForFile = getArrayAsString(parameter as Array);

                }

                parameters.Add(arrayElementValue);
                //parameters.Add(column);
                //parameters.Add(row);
                //parameters.Add(stringForFile);

                //logFile.WriteLine("stringForFile //////// " + stringForFile);
                //logFile.WriteLine("arrayElementValue //////// " + arrayElementValue);
                //logFile.WriteLine("column //////// " + column);
                //logFile.WriteLine("row //////// " + row);
                //logFile.WriteLine("");

            } else {

                for (int k = 0; k < parentExpressions.Length; k++) {
                    values += "{" + k + "},";

                    object parentExpression = parentExpressions[k];

                    if (is2DArray(parentExpression)) {
                        stringForFile = getMatrixAsString(parentExpression as Array);
                    } else if (is1DArray(parentExpression)) {
                        stringForFile = getArrayAsString(parentExpression as Array);
                    } else {
                        stringForFile = parentExpression.ToString();
                    }
                    
                    parameters.Add(stringForFile);

                    //logFile.WriteLine("");
                    //logFile.WriteLine("$$$$$$$$$$$$$$$ " + stringForFile);
                    //logFile.WriteLine("PROCEDENCE " + parentExpression);
                    //logFile.WriteLine("");
                }

            }

            values = values.TrimEnd(',');
            StringBuilder tmpSB = new StringBuilder();
            tmpSB.AppendFormat(values, parameters.ToArray());

            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(logString, tmpSB.ToString());
            logFile.WriteLine((logIndex++) + "~" + sb.ToString() + "~" + (nanoTime() - dt1) + "~" + column + "~" + row + "~" + stringForFile);

        }        

        public static bool logReference(String logString, object o) {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(logString, o);
            logFile.WriteLine((logIndex++) + "~" + sb.ToString() + "~" + (nanoTime() - dt1));
            //logFile.WriteLine((logIndex++) + "~" + sb.ToString() + "~" + (nanoTime()));
            return true;
        }


        public static void logSignal(String signalsString) {
            signalFile.WriteLine(signalsString + "~" + (nanoTime() - dt1));
        }


        public static bool logReferences(String logString, params object[] parentExpressions) {
            StringBuilder sb = new StringBuilder();
            string values = "";
            List<string> parameters = new List<string>();
            for (int i = 0; i < parentExpressions.Length; i++) {
                values += "{" + i + "},";
                parameters.Add(parentExpressions[i].ToString());
            }
            values = values.Substring(0, values.Length - 1);
            StringBuilder tmpSB = new StringBuilder();
            tmpSB.AppendFormat(values, parameters.ToArray());

            sb.AppendFormat(logString, tmpSB.ToString());
            logFile.WriteLine((logIndex++) + "~" + sb.ToString() + "~" + (nanoTime() - dt1));

            return true;
        }



        public static bool logReferences(string id, String logString, params object[] parentExpressions) {

            if (id != null) {
                if (!timesCounter.ContainsKey(id)) {
                    timesCounter.Add(id, 0);
                }
                increaseExecutionCount(id);
            }

            StringBuilder sb = new StringBuilder();

            string values = "";
            List<string> parameters = new List<string>();
            for (int i = 0; i < parentExpressions.Length; i++) {
                values += "{" + i + "},";
                parameters.Add(parentExpressions[i].ToString());
                
            }
            values = values.Substring(0, values.Length - 1);
            StringBuilder tmpSB = new StringBuilder();
            tmpSB.AppendFormat(values, parameters.ToArray());

            sb.AppendFormat(logString, tmpSB.ToString());
            //logFile.WriteLine((logIndex++) + "~" + sb.ToString() + "~" + (nanoTime()));
            logFile.WriteLine((logIndex++) + "~" + sb.ToString() + "~" + (nanoTime() - dt1));
            return true;
        }

        static void end() {
            logFile.Flush();
            logFile.Close();
            signalFile.Flush();
            signalFile.Close();
        }

        private static long nanoTime() {
            // TickCount cycles between Int32.MinValue, which is a negative
            // number, and Int32.MaxValue once every 49.8 days. This sample
            // removes the sign bit to yield a nonnegative number that cycles
            // between zero and Int32.MaxValue once every 24.9 days.
            long nano = 10000L * Stopwatch.GetTimestamp();
            nano /= TimeSpan.TicksPerMillisecond;
            nano *= 100L;            
            return nano;
        }

    }
}
