using System;

// namespace declaration 
namespace HelloWorldApp
{

    // Class declaration 
    class Geeks
    {

        // Main Method 
        static void Main(string[] args)
        { Logger.logLineInfo(@"C:\Users\hamid\Downloads\ConsoleApp1\ConsoleApp1\Program.cs~12~        {");

            // statement  Logger.logLineInfo(@"C:\Users\hamid\Downloads\ConsoleApp1\ConsoleApp1\Program.cs~14~            // statement ");
            // printing Hello World!  Logger.logLineInfo(@"C:\Users\hamid\Downloads\ConsoleApp1\ConsoleApp1\Program.cs~15~            // printing Hello World! ");
            Console.WriteLine("Hello World!"); Logger.logLineInfo(@"C:\Users\hamid\Downloads\ConsoleApp1\ConsoleApp1\Program.cs~16~            Console.WriteLine("Hello World!");");
            int a = 3; Logger.logLineInfo(@"C:\Users\hamid\Downloads\ConsoleApp1\ConsoleApp1\Program.cs~17~            int a = 3;");Logger.logInitialization(@"C:\Users\hamid\Downloads\ConsoleApp1\ConsoleApp1\Program.cs~a~17",a);
            // To prevent the screen from  Logger.logLineInfo(@"C:\Users\hamid\Downloads\ConsoleApp1\ConsoleApp1\Program.cs~18~            // To prevent the screen from ");
            // running and closing quickly  Logger.logLineInfo(@"C:\Users\hamid\Downloads\ConsoleApp1\ConsoleApp1\Program.cs~19~            // running and closing quickly ");
            Console.ReadKey(); Logger.logLineInfo(@"C:\Users\hamid\Downloads\ConsoleApp1\ConsoleApp1\Program.cs~20~            Console.ReadKey();");
        }
    }
}