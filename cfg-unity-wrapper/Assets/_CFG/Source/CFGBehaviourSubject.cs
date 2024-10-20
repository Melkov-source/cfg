using System.Collections.Generic;

namespace CFG
{
    public class CFGBehaviourSubject<TValue>
    {
        public delegate void ChangeBehaviourEvent(TValue old_value, TValue new_value);
        public TValue Value { get; private set; }

        private readonly List<ChangeBehaviourEvent> _events;
        
        
        public CFGBehaviourSubject(TValue default_value)
        {
            Value = default_value;
            _events = new List<ChangeBehaviourEvent>();
        }

        public void Next(TValue new_value)
        {
            var old_value = Value;
            
            Value = new_value;

            for (int index = 0, count = _events.Count; index < count; index++)
            {
                var @event = _events[index];

                @event(old_value, new_value);
            }
        }

        public void On(ChangeBehaviourEvent @event)
        {
            _events.Add(@event);
        }

        public void Off(ChangeBehaviourEvent @event)
        {
            _events.Remove(@event);
        }
    }
}