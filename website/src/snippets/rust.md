```rust
use std::fmt::{self, Display};

#[derive(Debug, Clone, PartialEq)]
pub enum TaskState<T, E> {
    Pending,
    Running { started_at: u64 },
    Done(Result<T, E>),
}

impl<T: Display, E: Display> TaskState<T, E> {
    /// Returns true if the task is finished.
    pub fn is_complete(&self) -> bool {
        matches!(self, TaskState::Done(Ok(_)))
    }
}

#[tokio::main]
async fn main() {
    let state = TaskState::Done(Ok("arborium"));
    println!("state = {:?}", state);
}
```
