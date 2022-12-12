using System;

namespace P_Inti
{
    internal class PeriodicTimer
    {
        private TimeSpan timeSpan;

        public PeriodicTimer(TimeSpan timeSpan)
        {
            this.timeSpan = timeSpan;
        }
    }
}