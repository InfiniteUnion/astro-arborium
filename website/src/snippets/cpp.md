```cpp
#pragma once
#include <iostream>
#include <memory>
#include <vector>

namespace arborium {

template <typename T>
class SyntaxTree {
public:
    explicit SyntaxTree(std::vector<T> nodes)
        : nodes_(std::move(nodes)) {}

    std::size_t size() const noexcept { return nodes_.size(); }

    void traverse(auto&& callback) const {
        for (const auto& node : nodes_) {
            callback(node);
        }
    }

private:
    std::vector<T> nodes_;
};

} // namespace arborium

int main() {
    auto tree = std::make_unique<arborium::SyntaxTree<int>>(
        std::vector<int>{1, 2, 3});
    std::cout << "nodes: " << tree->size() << '\n';
    return 0;
}
```
