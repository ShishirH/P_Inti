using System;
using System.Collections.Generic;
using System.Text;
using System.Globalization;
using System.Diagnostics;
using System.Reflection;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace ConsoleApp1 {

    class Logger {

        private static long dt1;
        private static int logIndex = 0;

        private static Stopwatch sw = new Stopwatch();
        public static System.IO.StreamWriter logFile = null;
        public static System.IO.StreamWriter signalFile = null;
        public static System.IO.StreamWriter lineInfoFile = null;
        public static System.IO.StreamWriter initializationFile = null;

        public static Dictionary<string, int> timesCounter = new Dictionary<string, int>();
        public static int getExecutionCount(string key) {
            if (key != null && !timesCounter.ContainsKey(key))
            {
                timesCounter.Add(key, 0);
            }

            else if (key != null) {
                return timesCounter[key];
            }
            return -1;
        }
        public static void increaseExecutionCount(string key) {
            if (key != null && !timesCounter.ContainsKey(key))
            {
                timesCounter.Add(key, 0);
            }

            else if (key != null) {
                timesCounter[key]++;
            }
        }

        
        static void init(string fileName) {
            dt1 = nanoTime();
            sw.Start();
            logFile = new System.IO.StreamWriter(System.IO.File.Create(fileName + ".log"));
            logFile.WriteLine("index~symbols~expressions~types~values~line~file~widgetsID~parentStatement~grandParentStatement~time~column~row~array~memoryAddress");

            signalFile = new System.IO.StreamWriter(System.IO.File.Create(fileName + ".signal"));
            signalFile.WriteLine("file~line~widgetsID~time");

            lineInfoFile = new System.IO.StreamWriter(System.IO.File.Create(fileName + ".lineInfo"));
            lineInfoFile.WriteLine("index~filePath~line~lineContent~time");

            initializationFile = new System.IO.StreamWriter(System.IO.File.Create(fileName + ".init"));
            initializationFile.WriteLine("filePath~symbol~lineNumber~value");
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

        public static bool isCustomClass(object o)
        {
            if (o == null)
            {
                return true;
            }

            string result = "";
            result = o.GetType() + " ~   " + o.GetType().Assembly.GetName().Name;
            if (o.GetType().Assembly.GetName().Name != "mscorlib")
            {
                // user-defined!
                result = result + " ~   " + (o.GetType().Assembly.GetName().Name != "mscorlib");
            }
            return o.GetType().Assembly.GetName().Name != "mscorlib";
        }

        public static JObject getFieldsForClass(object o)
        {
            if (o == null)
            {
                return null;
            }

            JObject fieldsObject = new JObject();
            foreach (FieldInfo field in o.GetType().GetFields())
            {
                string fieldName = field.Name;
                string fieldValue = (field.GetValue(o) == null) ? "null" : field.GetValue(o).ToString();

                if (fieldValue.IndexOf(".") != -1)
                {
                    int index = fieldValue.IndexOf(".");
                    if (Char.IsLetter(fieldValue[index + 1]))
                    {
                        // Object member is also an object. Call it recursively
                        JObject jObject = getFieldsForClass(field.GetValue(o));
                        fieldValue = jObject.ToString(Formatting.None);
                    }
                }
                fieldsObject.Add(fieldName, fieldValue);
            }

            fieldsObject.Add("memoryAddress", o.GetHashCode());
            return fieldsObject;
        }
        // for any assignment
        public static void logAssignment(String logString, params object[] parentExpressions) {

            string stringForFile = "";
            string parameterString = "";
            string row = "", column = "", arrayElementValue = "";
            string values = "";
            List<string> parameters = new List<string>();

            if (parentExpressions == null)
            {
                return;
            }
            object parameter = parentExpressions[0];
            bool isMatrix = is2DArray(parameter);
            bool isArray = is1DArray(parameter);
            bool isClass = isCustomClass(parameter);

            if (isClass) {
                // DO THE SAME FOR PROPERTIES
                JObject fieldValues = new JObject();
                JObject jObject = getFieldsForClass(parameter);

                if (parameter == null)
                {
                    stringForFile = "nullPointer";
                }
                else 
                {
                    stringForFile = jObject.ToString(Formatting.None);
                } 
                //parameters.Add(stringForFile);
                parameters.Add(stringForFile + "ASDASD");

            } else if ((isMatrix || isArray) && parentExpressions.Length == 3) {

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
                parameters.Add(stringForFile);

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

                    // Add condition for complex object
                    
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
            //logFile.WriteLine("$$$$$$$$$$$$$$$\t" + isClass);
            int hashCode = -1;
            if (parentExpressions[0] != null)
            {
                hashCode = parentExpressions[0].GetHashCode();
            }
            logFile.WriteLine((logIndex++) + "~" + sb.ToString() + "~" + (nanoTime() - dt1) + "~" + column + "~" + row + "~" + stringForFile + "~" + hashCode);
        }

        public static bool logReference(String logString, object o) {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(logString, o);
            logFile.WriteLine((logIndex++) + "~" + sb.ToString() + "~" + (nanoTime() - dt1) + "~" + o.GetHashCode());
            //logFile.WriteLine((logIndex++) + "~" + sb.ToString() + "~" + (nanoTime()));
            return true;
        }

        public static bool logInitialization(String logString, object o)
        {
            string initializationValue = "";
            // Only do this for custom classes?
            if (isCustomClass(o))
            {
                JObject initializationValueObject = getFieldsForClass(o);

                if (initializationValueObject != null)
                {
                    initializationValue = initializationValueObject.ToString(Formatting.None);
                }
            } 
            else if (is1DArray(o))
            {
                initializationValue = getArrayAsString(o as Array);
            }
            else if (is2DArray(o))
            {
                initializationValue = getMatrixAsString(o as Array);
            }
            else
            {
                initializationValue = Convert.ToString(o);
            }

            initializationFile.WriteLine(logString + "~" + initializationValue);
            //logFile.WriteLine((logIndex++) + "~" + sb.ToString() + "~" + (nanoTime()));
            return true;
        }

        public static void logSignal(String signalsString) {
            signalFile.WriteLine(signalsString + "~" + (nanoTime() - dt1));
        }

        public static void logLineInfo(String lineInfoString)
        {
            lineInfoFile.WriteLine(lineInfoString + "~" + (nanoTime() - dt1));
        }


        public static bool logReferences(String logString, params object[] parentExpressions) {
            StringBuilder sb = new StringBuilder();
            string values = "";
            List<string> parameters = new List<string>();
            for (int i = 0; i < parentExpressions.Length; i++) {
                values += "{" + i + "},";

                if (parentExpressions[i] == null)
                {
                    parameters.Add("null");
                }
                else
                {
                    parameters.Add(parentExpressions[i].ToString());

                }
            }
            values = values.Substring(0, values.Length - 1);
            StringBuilder tmpSB = new StringBuilder();
            tmpSB.AppendFormat(values, parameters.ToArray());

            sb.AppendFormat(logString, tmpSB.ToString());

            int hashCode = -1;

            if (parentExpressions[0] != null)
            {
                hashCode = parentExpressions[0].GetHashCode();
            }
            logFile.WriteLine((logIndex++) + "~" + sb.ToString() + "~" + (nanoTime() - dt1) + hashCode);

            return true;
        }



        public static bool logReferences(string id, String logString, params object[] parentExpressions) {

            // parentExpressions[i] = "root.next"
            //root.next = null
            if (id != null) {
                if (!timesCounter.ContainsKey(id)) {
                    timesCounter.Add(id, 0);
                }
                increaseExecutionCount(id);
            }

            StringBuilder sb = new StringBuilder();

            string values = "";
            List<string> parameters = new List<string>();
            int memoryAddress;
            for (int i = 0; i < parentExpressions.Length; i++) {
                values += "{" + i + "},";
                if (parentExpressions[i] == null)
                {
                    parameters.Add("null");
                } 
                else
                {
                    parameters.Add(parentExpressions[i].ToString());

                }
                //logFile.WriteLine("parentExpressions: " + getArrayAsString((int[]) parentExpressions[i]));
                //logFile.WriteLine("Memory address: " + parentExpressions[i].GetHashCode());
                //memoryAddress = parentExpressions[i].GetHashCode()
            }
            values = values.Substring(0, values.Length - 1);
            StringBuilder tmpSB = new StringBuilder();
            tmpSB.AppendFormat(values, parameters.ToArray());

            sb.AppendFormat(logString, tmpSB.ToString());
            int hashCode = -1;

            if (parentExpressions[0] != null)
            {
                hashCode = parentExpressions[0].GetHashCode();
            }

            //logFile.WriteLine((logIndex++) + "~" + sb.ToString() + "~" + (nanoTime()));
            logFile.WriteLine((logIndex++) + "~" + sb.ToString() + "~" + (nanoTime() - dt1) + "~" + hashCode);
            return true;
        }

        static void end() {
            logFile.Flush();
            logFile.Close();
            signalFile.Flush();
            signalFile.Close();
            lineInfoFile.Flush();
            lineInfoFile.Close();
            initializationFile.Flush();
            initializationFile.Close();
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
