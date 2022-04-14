# 在 macOS 12.3.1(Intel CPU) 下安装 nasm 汇编的方法

很简单，就一句：`brew install nasm`。

# 在 macOS 12.3.1(Intel CPU) 下编译的方法

以[官方教程](https://cs.lmu.edu/~ray/notes/nasmtutorial/)中的“Hello World”为例，代码如下：

```
; ----------------------------------------------------------------------------------------
; Writes "Hello, World" to the console using only system calls. Runs on 64-bit macOS only.
; To assemble and run:
;
;     nasm -fmacho64 hello.asm && ld hello.o && ./a.out
; ----------------------------------------------------------------------------------------

          global    start

          section   .text
start:    mov       rax, 0x02000004         ; system call for write
          mov       rdi, 1                  ; file handle 1 is stdout
          mov       rsi, message            ; address of string to output
          mov       rdx, 13                 ; number of bytes
          syscall                           ; invoke operating system to do the write
          mov       rax, 0x02000001         ; system call for exit
          xor       rdi, rdi                ; exit code 0
          syscall                           ; invoke operating system to exit

          section   .data
message:  db        "Hello, World", 10      ; note the newline at the end
```

依照代码中的注释，将上述代码保存为文件 hello.asm 。但当你按照注释中的命令 `nasm -fmacho64 hello.asm && ld hello.o && ./a.out` 进行编译时是不会成功的。为什么我还无法解释，我的方法是将命令分开执行。

首先，执行 `nasm -fmacho64 hello.asm`，这一步在我的机器上没有问题。成功后可以见到名为 `hello.o` 的文件。

然后，执行 `ld -e start -static hello.o -o hello`；如果成功可以见到一个可执行文件 `hello`，执行它看看是否符合预期。（注：其中 `-e start`并不是必需的。）

对此，[有人解释](https://stackoverflow.com/questions/52830484/nasm-cant-link-object-file-with-ld-on-macos-mojave)为：

> ld is defaulting to dynamic linking and tries to load crt1 which is looking for main. So specify static linking.

上面这段引用中提到的 `crt1` 可以参考“[Crt0](https://en.wikipedia.org/wiki/Crt0)”，或者直接看[这段解释](https://stackoverflow.com/questions/2709998/crt0-o-and-crt1-o-whats-the-difference)：

> Both crt0/crt1 do the same thing, basically do what is needed before calling main() (like initializing stack, setting irqs, etc.). You should link with one or the other but not both. They are not really libraries but really inline assembly code.
> As far as I understand, crt comes in two "flavors"
> * crt1 is used on systems that support constructors and destructors (functions called before and after main and exit). In this case main is treated like a normal function call.
> * crt0 is used on systems that do not support constructors/destructors.

# 参考教程

* 《纯汇编语言编写打飞机小游戏》https://blog.csdn.net/jiange_zh/article/details/47394337
