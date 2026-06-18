```java
package dev.arborium;

import java.util.List;
import java.util.Optional;

public record HighlightRequest(String source, String language) {
    public HighlightRequest {
        if (source == null || source.isBlank()) {
            throw new IllegalArgumentException("source must not be empty");
        }
    }
}

public class ArboriumHighlighter {
    private static final List<String> SUPPORTED = List.of(
        "rust", "typescript", "bash", "yaml", "cpp", "java", "markdown"
    );

    public Optional<String> highlight(HighlightRequest request) {
        if (!SUPPORTED.contains(request.language())) {
            return Optional.empty();
        }
        return Optional.of(render(request.source()));
    }

    private String render(String source) {
        return "<code>" + source + "</code>";
    }
}
```
