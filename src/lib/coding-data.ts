export type Lang = "c" | "cpp" | "python";

export const LANGUAGES: { id: Lang; label: string; ext: string }[] = [
  { id: "c", label: "C", ext: ".c" },
  { id: "cpp", label: "C++", ext: ".cpp" },
  { id: "python", label: "Python", ext: ".py" },
];

export interface Topic {
  id: string;
  title: string;
  theory: string;
  code: string;
}

export interface Section {
  id: string;
  title: string;
  topics: Topic[];
}

export const BOILERPLATE: Record<Lang, string> = {
  c: `#include <stdio.h>

int main() {
    int n = 5;
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    printf("Sum = %d\\n", sum);
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    int n = 5, sum = 0;
    for (int i = 1; i <= n; i++) sum += i;
    cout << "Sum = " << sum << endl;
    return 0;
}`,
  python: `n = 5
total = 0
for i in range(1, n + 1):
    total += i
print("Sum =", total)`,
};

export const SYLLABUS: Record<Lang, Section[]> = {
  c: [
    {
      id: "c-basics",
      title: "Basic Syntax",
      topics: [
        {
          id: "c-io",
          title: "Input & Output",
          theory:
            "C uses printf() and scanf() from stdio.h. Format specifiers map to types: %d for int, %f for float, %c for char, %s for string. scanf() needs the address of the variable, so pass &x for scalars.",
          code: `#include <stdio.h>\n\nint main() {\n    int age;\n    printf("Enter age: ");\n    scanf("%d", &age);\n    printf("Age is %d\\n", age);\n    return 0;\n}`,
        },
        {
          id: "c-loops",
          title: "Loops & Conditionals",
          theory:
            "C has if/else, switch, for, while and do-while. A do-while always runs at least once — a common interview trick question. break exits the loop, continue skips to the next iteration.",
          code: `#include <stdio.h>\n\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        if (i % 2 == 0) continue;\n        printf("%d ", i);\n    }\n    return 0;\n}`,
        },
      ],
    },
    {
      id: "c-memory",
      title: "Pointers & Memory Management",
      topics: [
        {
          id: "c-ptr",
          title: "Pointers Basics",
          theory:
            "A pointer stores an address. * declares and dereferences, & takes an address. Pointer arithmetic moves in units of the pointed-to type, so p+1 on an int* jumps 4 bytes on most systems.",
          code: `#include <stdio.h>\n\nint main() {\n    int x = 10;\n    int *p = &x;\n    printf("value=%d addr-deref=%d\\n", x, *p);\n    *p = 20;\n    printf("after=%d\\n", x);\n    return 0;\n}`,
        },
        {
          id: "c-malloc",
          title: "Dynamic Memory",
          theory:
            "malloc() allocates uninitialised heap memory, calloc() zeroes it, realloc() resizes and free() releases it. Every malloc must have a matching free or the program leaks memory — interviewers always ask this.",
          code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr = (int*)malloc(5 * sizeof(int));\n    for (int i = 0; i < 5; i++) arr[i] = i * i;\n    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);\n    free(arr);\n    return 0;\n}`,
        },
      ],
    },
    {
      id: "c-ds",
      title: "Data Structures",
      topics: [
        {
          id: "c-array",
          title: "Arrays & Strings",
          theory:
            "Arrays are contiguous memory blocks with 0-based indexing. Strings in C are char arrays ending with '\\0'. strlen() counts characters before the null terminator, so it is O(n).",
          code: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[] = "RiyasTech";\n    printf("len=%lu first=%c\\n", strlen(s), s[0]);\n    return 0;\n}`,
        },
        {
          id: "c-ll",
          title: "Linked List",
          theory:
            "A singly linked list node holds data and a pointer to the next node. Insertion at head is O(1), search is O(n). Reversing a linked list is the single most asked C interview question.",
          code: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node { int data; struct Node* next; };\n\nint main() {\n    struct Node* head = malloc(sizeof(struct Node));\n    head->data = 1; head->next = NULL;\n    printf("head=%d\\n", head->data);\n    free(head);\n    return 0;\n}`,
        },
      ],
    },
    {
      id: "c-top",
      title: "Top 30 Placement Questions",
      topics: [
        {
          id: "c-q1",
          title: "Reverse a String",
          theory:
            "Use two pointers from both ends and swap until they meet. Time O(n), space O(1). Watch for the null terminator — do not include it in the swap range.",
          code: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[] = "placement";\n    int i = 0, j = strlen(s) - 1;\n    while (i < j) { char t = s[i]; s[i++] = s[j]; s[j--] = t; }\n    printf("%s\\n", s);\n    return 0;\n}`,
        },
        {
          id: "c-q2",
          title: "Swap Without Third Variable",
          theory:
            "Use arithmetic (a = a + b; b = a - b; a = a - b) or XOR. Mention the overflow risk with arithmetic and the a == b edge case with XOR — that is what the interviewer is really testing.",
          code: `#include <stdio.h>\n\nint main() {\n    int a = 5, b = 9;\n    a = a ^ b; b = a ^ b; a = a ^ b;\n    printf("a=%d b=%d\\n", a, b);\n    return 0;\n}`,
        },
      ],
    },
  ],
  cpp: [
    {
      id: "cpp-basics",
      title: "Basic Syntax",
      topics: [
        {
          id: "cpp-io",
          title: "Streams & I/O",
          theory:
            "C++ uses cin and cout from <iostream>. They are type-safe, unlike printf. For competitive speed use ios_base::sync_with_stdio(false) and cin.tie(NULL).",
          code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    cout << "You entered " << n << endl;\n    return 0;\n}`,
        },
      ],
    },
    {
      id: "cpp-oops",
      title: "OOPs Concepts",
      topics: [
        {
          id: "cpp-class",
          title: "Classes & Objects",
          theory:
            "A class binds data and behaviour. Access specifiers are private (default), protected and public. Constructors initialise, destructors release resources — the RAII idea interviewers love.",
          code: `#include <iostream>\nusing namespace std;\n\nclass Sensor {\n    string name;\npublic:\n    Sensor(string n) : name(n) {}\n    void show() { cout << "Sensor: " << name << endl; }\n};\n\nint main() { Sensor s("LM35"); s.show(); return 0; }`,
        },
        {
          id: "cpp-poly",
          title: "Polymorphism & Virtual Functions",
          theory:
            "Compile-time polymorphism is overloading; runtime polymorphism is overriding through virtual functions and a vtable. A base class with virtual methods must have a virtual destructor.",
          code: `#include <iostream>\nusing namespace std;\n\nclass Shape { public: virtual void draw() { cout << "shape\\n"; } virtual ~Shape() {} };\nclass Circle : public Shape { public: void draw() override { cout << "circle\\n"; } };\n\nint main() { Shape* s = new Circle(); s->draw(); delete s; return 0; }`,
        },
        {
          id: "cpp-inherit",
          title: "Inheritance & Abstraction",
          theory:
            "C++ supports single, multiple, multilevel, hierarchical and hybrid inheritance. The diamond problem is solved with virtual inheritance. A pure virtual function (= 0) makes the class abstract.",
          code: `#include <iostream>\nusing namespace std;\n\nclass Device { public: virtual void start() = 0; };\nclass Motor : public Device { public: void start() { cout << "motor running\\n"; } };\n\nint main() { Motor m; m.start(); return 0; }`,
        },
      ],
    },
    {
      id: "cpp-ds",
      title: "Data Structures & STL",
      topics: [
        {
          id: "cpp-stl",
          title: "STL Containers",
          theory:
            "vector is a dynamic array with amortised O(1) push_back. map is a balanced tree with O(log n) lookup; unordered_map is a hash table with average O(1). Know when each is the right answer.",
          code: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v{4, 1, 7};\n    v.push_back(9);\n    for (int x : v) cout << x << " ";\n    return 0;\n}`,
        },
      ],
    },
    {
      id: "cpp-memory",
      title: "Memory Management",
      topics: [
        {
          id: "cpp-new",
          title: "new / delete & Smart Pointers",
          theory:
            "new allocates on the heap, delete frees it; use delete[] for arrays. Modern C++ prefers unique_ptr and shared_ptr, which free automatically when they go out of scope.",
          code: `#include <iostream>\n#include <memory>\nusing namespace std;\n\nint main() {\n    auto p = make_unique<int>(42);\n    cout << *p << endl;\n    return 0;\n}`,
        },
      ],
    },
    {
      id: "cpp-top",
      title: "Top 30 Placement Questions",
      topics: [
        {
          id: "cpp-q1",
          title: "Find Second Largest Element",
          theory:
            "Single pass with two trackers: largest and second. Time O(n), space O(1). Handle duplicates and arrays with fewer than two distinct values.",
          code: `#include <iostream>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int a[] = {12, 35, 1, 10, 34, 1};\n    int first = INT_MIN, second = INT_MIN;\n    for (int x : a) {\n        if (x > first) { second = first; first = x; }\n        else if (x > second && x != first) second = x;\n    }\n    cout << second << endl;\n    return 0;\n}`,
        },
      ],
    },
  ],
  python: [
    {
      id: "py-basics",
      title: "Basic Syntax",
      topics: [
        {
          id: "py-io",
          title: "Variables & I/O",
          theory:
            "Python is dynamically typed — no declarations needed. input() always returns a string, so cast with int() or float(). f-strings are the cleanest way to format output.",
          code: `name = "Riyas"\nmarks = 92\nprint(f"{name} scored {marks}")`,
        },
        {
          id: "py-loops",
          title: "Loops & Comprehensions",
          theory:
            "for iterates over any iterable. range(a, b, step) is lazy. List comprehensions ([x*x for x in range(5)]) are faster and more Pythonic than manual append loops.",
          code: `squares = [x * x for x in range(1, 6)]\nprint(squares)`,
        },
      ],
    },
    {
      id: "py-ds",
      title: "Data Structures",
      topics: [
        {
          id: "py-collections",
          title: "List, Tuple, Set, Dict",
          theory:
            "Lists are mutable and ordered, tuples are immutable, sets store unique items with O(1) membership tests, dicts are hash maps with O(1) average lookup. Knowing the time complexity of each is a standard interview question.",
          code: `nums = [3, 1, 3, 7]\nprint(sorted(set(nums)))\nd = {"a": 1, "b": 2}\nprint(d.get("c", 0))`,
        },
      ],
    },
    {
      id: "py-oops",
      title: "OOPs Concepts",
      topics: [
        {
          id: "py-class",
          title: "Classes, Inheritance, Dunder Methods",
          theory:
            "__init__ is the constructor and self is the instance reference. Python supports multiple inheritance resolved by the MRO. __str__ controls printing and __len__ controls len().",
          code: `class Component:\n    def __init__(self, name):\n        self.name = name\n    def __str__(self):\n        return f"Component({self.name})"\n\nprint(Component("LM35"))`,
        },
      ],
    },
    {
      id: "py-memory",
      title: "Memory Management",
      topics: [
        {
          id: "py-gc",
          title: "References & Garbage Collection",
          theory:
            "Python uses reference counting plus a cyclic garbage collector. Everything is an object; assignment binds a name to an object, it does not copy. Mutable default arguments are a classic bug — use None instead.",
          code: `import sys\nx = [1, 2, 3]\ny = x\nprint(sys.getrefcount(x))\ny.append(4)\nprint(x)`,
        },
      ],
    },
    {
      id: "py-top",
      title: "Top 30 Placement Questions",
      topics: [
        {
          id: "py-q1",
          title: "Check Palindrome",
          theory:
            "Slicing s == s[::-1] is the one-liner, but interviewers often want the two-pointer version to show you understand O(1) space.",
          code: `def is_pal(s):\n    s = s.lower().replace(" ", "")\n    return s == s[::-1]\n\nprint(is_pal("Never odd or even"))`,
        },
        {
          id: "py-q2",
          title: "Count Character Frequency",
          theory:
            "Use collections.Counter for O(n) frequency counting. Be ready to write the manual dict version too.",
          code: `from collections import Counter\n\nprint(Counter("engineering"))`,
        },
      ],
    },
  ],
};

export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  langs: Lang[];
  statement: string;
  tests: { input: string; expected: string }[];
  company: string;
}

export const PROBLEMS: Problem[] = [
  {
    id: "p1",
    title: "Sum of First N Natural Numbers",
    difficulty: "Easy",
    langs: ["c", "cpp", "python"],
    statement: "Given N, print the sum 1 + 2 + ... + N.",
    tests: [
      { input: "5", expected: "15" },
      { input: "10", expected: "55" },
    ],
    company: "Bosch",
  },
  {
    id: "p2",
    title: "Reverse a String",
    difficulty: "Easy",
    langs: ["c", "cpp", "python"],
    statement: "Reverse the given string in place without using library reverse functions.",
    tests: [
      { input: "abc", expected: "cba" },
      { input: "core", expected: "eroc" },
    ],
    company: "TCS Digital",
  },
  {
    id: "p3",
    title: "Second Largest in Array",
    difficulty: "Medium",
    langs: ["c", "cpp", "python"],
    statement: "Find the second largest distinct element of an array in a single pass.",
    tests: [
      { input: "12 35 1 10 34", expected: "34" },
      { input: "5 5 4", expected: "4" },
    ],
    company: "Qualcomm",
  },
  {
    id: "p4",
    title: "Detect Loop in Linked List",
    difficulty: "Medium",
    langs: ["c", "cpp"],
    statement: "Use Floyd's slow and fast pointer method to detect a cycle.",
    tests: [{ input: "1->2->3->1", expected: "true" }],
    company: "Intel",
  },
  {
    id: "p5",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Hard",
    langs: ["cpp", "python"],
    statement: "Return the length of the longest substring with all unique characters using a sliding window.",
    tests: [
      { input: "abcabcbb", expected: "3" },
      { input: "bbbbb", expected: "1" },
    ],
    company: "NVIDIA",
  },
  {
    id: "p6",
    title: "Matrix Spiral Traversal",
    difficulty: "Hard",
    langs: ["c", "cpp", "python"],
    statement: "Print all elements of an M x N matrix in spiral order.",
    tests: [{ input: "1 2 3 / 4 5 6 / 7 8 9", expected: "1 2 3 6 9 8 7 4 5" }],
    company: "Texas Instruments",
  },
  {
    id: "p7",
    title: "Memory Leak Fix in Dynamic Array",
    difficulty: "Medium",
    langs: ["c"],
    statement: "Given a malloc-based array routine, identify and fix the leak and the dangling pointer.",
    tests: [{ input: "n=5", expected: "no leak" }],
    company: "NXP Semiconductors",
  },
  {
    id: "p8",
    title: "Virtual Function Output Prediction",
    difficulty: "Easy",
    langs: ["cpp"],
    statement: "Predict the printed output of a base/derived pair with and without the virtual keyword.",
    tests: [{ input: "virtual", expected: "derived" }],
    company: "Siemens",
  },
];
