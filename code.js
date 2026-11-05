/* 数据结构基本运算代码手册：按数据结构分类，C/C++ 风格，供背诵与手写参考 */
/* 代码手册 · 分片1：线性结构（顺序表 / 单链表 / 双链表 / 静态链表） */
window.CODEBOOK = window.CODEBOOK || { groups: [] };

window.CODEBOOK.groups.push({
  id: "seqlist", name: "顺序表", cat: "线性结构",
  desc: "顺序表用一段连续的存储单元依次存放线性表元素，逻辑相邻即物理相邻。核心特征是随机存取：按下标计算地址只需 O(1)，代价是插入删除平均要移动一半元素。",
  type: `#define MaxSize 100
typedef int ElemType;          /* 元素类型，按题目替换 */
typedef struct {
    ElemType data[MaxSize];    /* 存放元素 */
    int length;                /* 当前长度 */
} SqList;`,
  tips: "顺序表题目里最容易丢分的是插入删除的下标范围判断：插入合法位置是 1≤i≤length+1，删除是 1≤i≤length，且循环方向不能写反。",
  ops: [
    {
      name: "初始化列表", sig: "void InitList(SqList *&L)", time: "O(1)",
      code: `void InitList(SqList *&L) {
    L = (SqList *)malloc(sizeof(SqList));
    L->length = 0;              /* 空表长度为 0 */
}`,
      tips: "只分配空间并把 length 置 0，data 数组内容不初始化，用不到。"
    },
    {
      name: "整体建表", sig: "void CreateList(SqList *&L, ElemType a[], int n)", time: "O(n)",
      code: `void CreateList(SqList *&L, ElemType a[], int n) {
    L = (SqList *)malloc(sizeof(SqList));
    for (int i = 0; i < n; i++)
        L->data[i] = a[i];      /* 逐个复制到顺序表 */
    L->length = n;
}`,
      tips: "建表时先判断 n 是否超过 MaxSize，超过要报错而不是覆盖越界。"
    },
    {
      name: "销毁列表", sig: "void DestroyList(SqList *&L)", time: "O(1)",
      code: `void DestroyList(SqList *&L) {
    free(L);                    /* 释放动态分配的数组空间 */
    L = NULL;
}`,
      tips: "释放后把指针置空，避免后续误用野指针。"
    },
    {
      name: "求表长", sig: "int ListLength(SqList *L)", time: "O(1)",
      code: `int ListLength(SqList *L) {
    return L->length;           /* 直接返回 length 域 */
}`,
      tips: "顺序表长度是 O(1)，链表求长度才是 O(n)，这个对比经常被考。"
    },
    {
      name: "按序号取元素", sig: "bool GetElem(SqList *L, int i, ElemType &e)", time: "O(1)",
      code: `bool GetElem(SqList *L, int i, ElemType &e) {
    if (i < 1 || i > L->length) return false;   /* 逻辑序号 1..length */
    e = L->data[i - 1];         /* 逻辑序号 i 对应下标 i-1 */
    return true;
}`,
      tips: "逻辑序号从 1 开始、数组下标从 0 开始，所有顺序表题目都要做这一步换算。"
    },
    {
      name: "按值查找", sig: "int LocateElem(SqList *L, ElemType e)", time: "O(n)",
      code: `int LocateElem(SqList *L, ElemType e) {
    for (int i = 0; i < L->length; i++)
        if (L->data[i] == e) return i + 1;      /* 返回逻辑序号 */
    return 0;                   /* 0 表示未找到 */
}`,
      tips: "返回逻辑序号还是下标，题目没写清楚时按教材约定返回逻辑序号。"
    },
    {
      name: "插入元素", sig: "bool ListInsert(SqList *&L, int i, ElemType e)", time: "O(n)",
      code: `bool ListInsert(SqList *&L, int i, ElemType e) {
    if (i < 1 || i > L->length + 1) return false;   /* 可插入位置 */
    if (L->length >= MaxSize) return false;         /* 表满 */
    for (int j = L->length; j > i - 1; j--)
        L->data[j] = L->data[j - 1];  /* 从后往前后移，腾出下标 i-1 */
    L->data[i - 1] = e;
    L->length++;
    return true;
}`,
      tips: "移动必须从后往前，否则前面的元素会覆盖后面的数据。平均移动 n/2 个元素。"
    },
    {
      name: "删除元素", sig: "bool ListDelete(SqList *&L, int i, ElemType &e)", time: "O(n)",
      code: `bool ListDelete(SqList *&L, int i, ElemType &e) {
    if (i < 1 || i > L->length) return false;       /* 可删除位置 */
    e = L->data[i - 1];         /* 先保存被删元素 */
    for (int j = i; j < L->length; j++)
        L->data[j - 1] = L->data[j];  /* 从前往前移，填补空位 */
    L->length--;
    return true;
}`,
      tips: "删除是插入的逆操作：循环从前往后，把后面的元素依次前移一位。平均移动 (n-1)/2 个元素。"
    },
    {
      name: "输出全部元素", sig: "void DispList(SqList *L)", time: "O(n)",
      code: `void DispList(SqList *L) {
    for (int i = 0; i < L->length; i++)
        printf("%d ", L->data[i]);
    printf("\\n");
}`,
      tips: "考试写算法题时输出函数一般不用写，但调试时很有用。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "linklist", name: "单链表", cat: "线性结构",
  desc: "单链表用一组任意的存储单元存放元素，每个结点由数据域和指针域组成。逻辑关系靠指针表示，所以插入删除不需移动元素，只要改指针，代价是不能随机存取，找第 i 个必须从头走。",
  type: `typedef int ElemType;
typedef struct LNode {
    ElemType data;             /* 数据域 */
    struct LNode *next;        /* 指针域，指向后继 */
} LinkNode;                    /* 单链表结点类型 */`,
  tips: "单链表题的两个固定套路：一是有序表合并要用尾指针方便挂链，二是删除结点必须先找到前驱。带不带头结点两种写法要能互换。",
  ops: [
    {
      name: "头插法建表", sig: "void CreateListF(LinkNode *&L, ElemType a[], int n)", time: "O(n)",
      code: `void CreateListF(LinkNode *&L, ElemType a[], int n) {
    L = (LinkNode *)malloc(sizeof(LinkNode));   /* 创建头结点 */
    L->next = NULL;
    LinkNode *s;
    for (int i = 0; i < n; i++) {
        s = (LinkNode *)malloc(sizeof(LinkNode));
        s->data = a[i];
        s->next = L->next;      /* 新结点指向原首结点 */
        L->next = s;            /* 头结点指向新结点 */
    }
}`,
      tips: "头插法建出的表与输入顺序相反，若题目要求逆序输出即可利用这一点。"
    },
    {
      name: "尾插法建表", sig: "void CreateListR(LinkNode *&L, ElemType a[], int n)", time: "O(n)",
      code: `void CreateListR(LinkNode *&L, ElemType a[], int n) {
    L = (LinkNode *)malloc(sizeof(LinkNode));
    L->next = NULL;
    LinkNode *s, *r = L;        /* r 始终指向尾结点 */
    for (int i = 0; i < n; i++) {
        s = (LinkNode *)malloc(sizeof(LinkNode));
        s->data = a[i];
        r->next = s;            /* 挂到尾部 */
        r = s;                  /* 尾指针后移 */
    }
    r->next = NULL;             /* 尾结点指针置空 */
}`,
      tips: "尾插法必须保留尾指针 r，否则每次都要从头找尾，退化成 O(n²)。"
    },
    {
      name: "销毁链表", sig: "void DestroyList(LinkNode *&L)", time: "O(n)",
      code: `void DestroyList(LinkNode *&L) {
    LinkNode *p = L, *q = p->next;
    while (q != NULL) {
        free(p);                /* 先释放前驱 */
        p = q;
        q = p->next;            /* 先保存后继再释放，顺序不能反 */
    }
    free(p);                    /* 释放最后一个结点 */
    L = NULL;
}`,
      tips: "释放前必须先把 next 存到 q，直接 free(p) 后再 p->next 会访问已释放内存。"
    },
    {
      name: "求表长", sig: "int ListLength(LinkNode *L)", time: "O(n)",
      code: `int ListLength(LinkNode *L) {
    int n = 0;
    LinkNode *p = L->next;      /* 跳过头结点 */
    while (p != NULL) {
        n++;
        p = p->next;
    }
    return n;
}`,
      tips: "计数从首结点开始，头结点不算元素个数，这是最常见的低级错误。"
    },
    {
      name: "按序号取元素", sig: "bool GetElem(LinkNode *L, int i, ElemType &e)", time: "O(n)",
      code: `bool GetElem(LinkNode *L, int i, ElemType &e) {
    int j = 0;
    LinkNode *p = L;            /* p 指向头结点，j 为已走过的结点数 */
    if (i <= 0) return false;
    while (j < i && p != NULL) { /* 走 i 步到达第 i 个结点 */
        j++;
        p = p->next;
    }
    if (p == NULL) return false;
    e = p->data;
    return true;
}`,
      tips: "p 从头结点出发，走 i 步正好指向第 i 个数据结点，这个起点设定是关键。"
    },
    {
      name: "按值查找", sig: "int LocateElem(LinkNode *L, ElemType e)", time: "O(n)",
      code: `int LocateElem(LinkNode *L, ElemType e) {
    int i = 1;
    LinkNode *p = L->next;
    while (p != NULL && p->data != e) {
        p = p->next;
        i++;
    }
    if (p == NULL) return 0;
    return i;                   /* 返回首次出现的逻辑序号 */
}`,
      tips: "循环条件写成 p->data != e 是错的，必须先判 p 非空，短路求值顺序不能调换。"
    },
    {
      name: "插入结点", sig: "bool ListInsert(LinkNode *&L, int i, ElemType e)", time: "O(n)",
      code: `bool ListInsert(LinkNode *&L, int i, ElemType e) {
    if (i < 1) return false;
    int j = 0;
    LinkNode *p = L, *s;
    while (j < i - 1 && p != NULL) {   /* 找第 i-1 个结点 */
        j++;
        p = p->next;
    }
    if (p == NULL) return false;
    s = (LinkNode *)malloc(sizeof(LinkNode));
    s->data = e;
    s->next = p->next;          /* 先连后继，再断开前驱，顺序不能反 */
    p->next = s;
    return true;
}`,
      tips: "两句指针修改顺序写反会丢链：必须先让新结点指向后继，再让前驱指向新结点。"
    },
    {
      name: "删除结点", sig: "bool ListDelete(LinkNode *&L, int i, ElemType &e)", time: "O(n)",
      code: `bool ListDelete(LinkNode *&L, int i, ElemType &e) {
    if (i < 1) return false;
    int j = 0;
    LinkNode *p = L, *q;
    while (j < i - 1 && p != NULL) {   /* 找第 i-1 个结点 */
        j++;
        p = p->next;
    }
    if (p == NULL || p->next == NULL) return false;  /* 第 i 个不存在 */
    q = p->next;                /* q 指向被删结点 */
    e = q->data;
    p->next = q->next;          /* 跨过被删结点 */
    free(q);
    return true;
}`,
      tips: "删除前驱为 p 的后继时，一定要先判 p->next 非空，否则会删到 NULL。"
    },
    {
      name: "输出全部元素", sig: "void DispList(LinkNode *L)", time: "O(n)",
      code: `void DispList(LinkNode *L) {
    LinkNode *p = L->next;
    while (p != NULL) {
        printf("%d ", p->data);
        p = p->next;
    }
    printf("\\n");
}`,
      tips: "遍历统一从 L->next 开始，写完算法的验证输出就靠它。"
    },
    {
      name: "就地逆置链表", sig: "void ReverseList(LinkNode *&L)", time: "O(n)",
      code: `void ReverseList(LinkNode *&L) {
    LinkNode *p = L->next, *q;
    L->next = NULL;             /* 头结点摘下来当新表头 */
    while (p != NULL) {
        q = p->next;            /* 先存后继 */
        p->next = L->next;      /* 头插法插回 */
        L->next = p;
        p = q;
    }
}`,
      tips: "就地逆置是用头插法重建链表，空间复杂度 O(1)，是算法设计题的高频模板。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "dlinklist", name: "双链表", cat: "线性结构",
  desc: "双链表每个结点多一个 prior 指针指向前驱，因此可以双向遍历、在 O(1) 时间内知道前驱。插入删除要同时修改两个方向的指针，共四条链接，少改一条就会断链。",
  type: `typedef int ElemType;
typedef struct DNode {
    ElemType data;
    struct DNode *prior;       /* 指向前驱 */
    struct DNode *next;        /* 指向后继 */
} DLinkNode;`,
  tips: "双链表的插入删除必须成对处理 prior 和 next；尾插法建表时要注意首结点的 prior 置空。",
  ops: [
    {
      name: "尾插法建表", sig: "void CreateListR(DLinkNode *&L, ElemType a[], int n)", time: "O(n)",
      code: `void CreateListR(DLinkNode *&L, ElemType a[], int n) {
    L = (DLinkNode *)malloc(sizeof(DLinkNode));
    L->prior = L->next = NULL;  /* 头结点两个指针都置空 */
    DLinkNode *s, *r = L;
    for (int i = 0; i < n; i++) {
        s = (DLinkNode *)malloc(sizeof(DLinkNode));
        s->data = a[i];
        r->next = s;            /* 前驱的后继指向 s */
        s->prior = r;           /* s 的前驱指向 r */
        r = s;
    }
    r->next = NULL;             /* 尾结点后继置空 */
}`,
      tips: "每挂一个结点要同时改 r->next 和 s->prior，两个方向都要对上。"
    },
    {
      name: "销毁链表", sig: "void DestroyList(DLinkNode *&L)", time: "O(n)",
      code: `void DestroyList(DLinkNode *&L) {
    DLinkNode *p = L, *q = p->next;
    while (q != NULL) {
        free(p);
        p = q;
        q = p->next;
    }
    free(p);
    L = NULL;
}`,
      tips: "销毁只需顺着 next 走，prior 指针不用管，但要注意先存后继再释放。"
    },
    {
      name: "求表长", sig: "int ListLength(DLinkNode *L)", time: "O(n)",
      code: `int ListLength(DLinkNode *L) {
    int n = 0;
    DLinkNode *p = L->next;
    while (p != NULL) {
        n++;
        p = p->next;
    }
    return n;
}`,
      tips: "与单链表完全一致，从首结点开始数。"
    },
    {
      name: "插入结点", sig: "bool ListInsert(DLinkNode *&L, int i, ElemType e)", time: "O(n)",
      code: `bool ListInsert(DLinkNode *&L, int i, ElemType e) {
    if (i < 1) return false;
    int j = 0;
    DLinkNode *p = L, *s;
    while (j < i - 1 && p != NULL) {  /* 找第 i-1 个结点 */
        j++;
        p = p->next;
    }
    if (p == NULL) return false;
    s = (DLinkNode *)malloc(sizeof(DLinkNode));
    s->data = e;
    s->next = p->next;          /* ① 新结点后继 */
    if (p->next != NULL)
        p->next->prior = s;     /* ② 后继的前驱指向新结点 */
    s->prior = p;               /* ③ 新结点前驱 */
    p->next = s;                /* ④ 前驱的后继 */
    return true;
}`,
      tips: "四个指针赋值按 ①②③④ 顺序写，第 ② 步必须先判 p->next 非空，否则插到表尾会空指针。"
    },
    {
      name: "删除结点", sig: "bool ListDelete(DLinkNode *&L, int i, ElemType &e)", time: "O(n)",
      code: `bool ListDelete(DLinkNode *&L, int i, ElemType &e) {
    if (i < 1) return false;
    int j = 0;
    DLinkNode *p = L, *q;
    while (j < i - 1 && p != NULL) {
        j++;
        p = p->next;
    }
    if (p == NULL || p->next == NULL) return false;
    q = p->next;
    e = q->data;
    if (q->next != NULL)
        q->next->prior = p;     /* 后继的前驱跨过 q 指向 p */
    p->next = q->next;
    free(q);
    return true;
}`,
      tips: "删尾结点时 q->next 为 NULL，所以修改 q->next->prior 前必须先判空。"
    },
    {
      name: "按序号取元素", sig: "bool GetElem(DLinkNode *L, int i, ElemType &e)", time: "O(n)",
      code: `bool GetElem(DLinkNode *L, int i, ElemType &e) {
    int j = 0;
    DLinkNode *p = L;
    if (i <= 0) return false;
    while (j < i && p != NULL) {
        j++;
        p = p->next;
    }
    if (p == NULL) return false;
    e = p->data;
    return true;
}`,
      tips: "双链表已知结点时可以双向逼近查找，但从表头找第 i 个仍是 O(n)。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "slinklist", name: "静态链表", cat: "线性结构",
  desc: "静态链表用数组模拟链表：每个分量有 data 和 next（存放下一个元素的下标，叫游标）。它兼顾了顺序表的连续存储和链表的免移动特性，常用于不支持指针的语言。",
  type: `#define MaxSize 100
typedef int ElemType;
typedef struct {
    ElemType data;
    int next;                  /* 游标，存放下一个元素的下标 */
} SLinkList[MaxSize];          /* 静态链表类型：结构体数组 */`,
  tips: "静态链表的下标 0 通常作头结点、下标 -1 表示空指针；实际考试更常见的是考「用数组实现链表」的思想而不是完整代码。",
  ops: [
    {
      name: "初始化静态链表", sig: "void InitList(SLinkList &L)", time: "O(1)",
      code: `void InitList(SLinkList &L) {
    L[0].next = -1;             /* 头结点，-1 表示空 */
}`,
      tips: "约定 L[0] 为头结点，next=-1 当作 NULL 使用。"
    },
    {
      name: "分配一个结点", sig: "int MallocNode(SLinkList &L)", time: "O(n)",
      code: `int MallocNode(SLinkList &L) {
    for (int i = 1; i < MaxSize; i++)
        if (L[i].next == -2)    /* -2 表示该位置空闲 */
            return i;
    return -1;                  /* 空间已满 */
}`,
      tips: "需要预先把所有空闲位置的 next 置为 -2，用 -2 标记空闲是常见约定。"
    },
    {
      name: "回收一个结点", sig: "void FreeNode(SLinkList &L, int i)", time: "O(1)",
      code: `void FreeNode(SLinkList &L, int i) {
    L[i].next = -2;             /* 置为可用 */
}`,
      tips: "静态链表没有真正的 free，回收就是把标记改回空闲。"
    },
    {
      name: "插入元素", sig: "bool ListInsert(SLinkList &L, int i, ElemType e)", time: "O(n)",
      code: `bool ListInsert(SLinkList &L, int i, ElemType e) {
    if (i < 1) return false;
    int p = 0, j = 0;           /* p 从表头开始 */
    while (p != -1 && j < i - 1) {
        p = L[p].next;          /* 沿游标走到第 i-1 个 */
        j++;
    }
    if (p == -1) return false;
    int s = MallocNode(L);      /* 申请新结点 */
    if (s == -1) return false;
    L[s].data = e;
    L[s].next = L[p].next;      /* 新结点指后 */
    L[p].next = s;              /* 前驱指新 */
    return true;
}`,
      tips: "完全是单链表插入的数组版，把 p->next 换成 L[p].next 即可。"
    },
    {
      name: "删除元素", sig: "bool ListDelete(SLinkList &L, int i, ElemType &e)", time: "O(n)",
      code: `bool ListDelete(SLinkList &L, int i, ElemType &e) {
    if (i < 1) return false;
    int p = 0, j = 0;
    while (p != -1 && j < i - 1) {
        p = L[p].next;
        j++;
    }
    if (p == -1 || L[p].next == -1) return false;
    int q = L[p].next;          /* q 为被删结点下标 */
    e = L[q].data;
    L[p].next = L[q].next;      /* 跨过 q */
    FreeNode(L, q);
    return true;
}`,
      tips: "删除后必须调用 FreeNode，否则节点永远占着空间。"
    },
    {
      name: "输出全部元素", sig: "void DispList(SLinkList &L)", time: "O(n)",
      code: `void DispList(SLinkList &L) {
    int p = L[0].next;          /* 从第一个数据结点开始 */
    while (p != -1) {
        printf("%d ", L[p].data);
        p = L[p].next;
    }
    printf("\\n");
}`,
      tips: "注意起点是 L[0].next，不是下标 1，头结点不存数据。"
    }
  ]
});

/* 代码手册 · 分片2：栈和队列、串 */
window.CODEBOOK = window.CODEBOOK || { groups: [] };

window.CODEBOOK.groups.push({
  id: "sqstack", name: "顺序栈", cat: "栈和队列",
  desc: "顺序栈用数组加一个栈顶指针 top 实现。约定 top 指向栈顶元素，空栈时 top=-1。进栈是 top 先加再存，出栈是先取再减，顺序反了就错。",
  type: `#define MaxSize 100
typedef int ElemType;
typedef struct {
    ElemType data[MaxSize];
    int top;                   /* 栈顶指针，空栈为 -1 */
} SqStack;`,
  tips: "栈的四大基本运算判断题常考 top 的取值：空栈 top=-1、栈满 top=MaxSize-1、元素个数=top+1。",
  ops: [
    {
      name: "初始化栈", sig: "void InitStack(SqStack *&s)", time: "O(1)",
      code: `void InitStack(SqStack *&s) {
    s = (SqStack *)malloc(sizeof(SqStack));
    s->top = -1;               /* 空栈 */
}`,
      tips: "top=-1 表示空栈，不要写成 0，0 表示已有一个元素。"
    },
    {
      name: "销毁栈", sig: "void DestroyStack(SqStack *&s)", time: "O(1)",
      code: `void DestroyStack(SqStack *&s) {
    free(s);
    s = NULL;
}`,
      tips: "顺序栈空间是整体分配的，释放一次即可。"
    },
    {
      name: "判断栈空", sig: "bool StackEmpty(SqStack *s)", time: "O(1)",
      code: `bool StackEmpty(SqStack *s) {
    return (s->top == -1);
}`,
      tips: "判空条件是 top==-1，不是 top==0。"
    },
    {
      name: "进栈", sig: "bool Push(SqStack *&s, ElemType e)", time: "O(1)",
      code: `bool Push(SqStack *&s, ElemType e) {
    if (s->top == MaxSize - 1) return false;   /* 栈满 */
    s->top++;                  /* 栈顶指针先加 */
    s->data[s->top] = e;       /* 再存元素 */
    return true;
}`,
      tips: "先移动指针再存值，两句顺序反了会把元素写到 old top 位置。"
    },
    {
      name: "出栈", sig: "bool Pop(SqStack *&s, ElemType &e)", time: "O(1)",
      code: `bool Pop(SqStack *&s, ElemType &e) {
    if (s->top == -1) return false;   /* 栈空 */
    e = s->data[s->top];       /* 先取出栈顶元素 */
    s->top--;                  /* 再减指针 */
    return true;
}`,
      tips: "与进栈相反：先取后减。出栈只是逻辑删除，数据还留在数组里。"
    },
    {
      name: "取栈顶元素", sig: "bool GetTop(SqStack *s, ElemType &e)", time: "O(1)",
      code: `bool GetTop(SqStack *s, ElemType &e) {
    if (s->top == -1) return false;
    e = s->data[s->top];       /* 只取不改变 top */
    return true;
}`,
      tips: "取栈顶不弹出，top 保持不变，这是和 Pop 的唯一区别。"
    },
    {
      name: "括号匹配检验", sig: "bool Match(char exp[], int n)", time: "O(n)",
      code: `bool Match(char exp[], int n) {
    SqStack *st; InitStack(st);
    for (int i = 0; i < n; i++) {
        if (exp[i] == '(' || exp[i] == '[' || exp[i] == '{')
            Push(st, exp[i]);
        else if (exp[i] == ')' || exp[i] == ']' || exp[i] == '}') {
            if (StackEmpty(st)) { DestroyStack(st); return false; }
            ElemType t; Pop(st, t);
            if ((exp[i]==')'&&t!='(') || (exp[i]==']'&&t!='[') || (exp[i]=='}'&&t!='{'))
                { DestroyStack(st); return false; }
        }
    }
    bool ok = StackEmpty(st);  /* 结束后栈必须为空 */
    DestroyStack(st);
    return ok;
}`,
      tips: "右括号出栈时要检查类型是否配对，循环结束后还要判栈空，这两点最容易漏。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "linkstack", name: "链栈", cat: "栈和队列",
  desc: "链栈用单链表实现栈，通常不带头结点，栈顶就是首结点。进栈用头插法，出栈删除首结点，两者的时间复杂度都是 O(1)，且不存在栈满问题。",
  type: `typedef int ElemType;
typedef struct linknode {
    ElemType data;
    struct linknode *next;
} LinkStNode;                  /* 链栈结点 */`,
  tips: "链栈不带头结点时，栈空判据是 s->next==NULL，进栈出栈都在表头操作。",
  ops: [
    {
      name: "初始化栈", sig: "void InitStack(LinkStNode *&s)", time: "O(1)",
      code: `void InitStack(LinkStNode *&s) {
    s = (LinkStNode *)malloc(sizeof(LinkStNode));
    s->next = NULL;             /* 头结点，无数据 */
}`,
      tips: "这里采用带头结点的写法，首结点才是栈顶元素，判空看 s->next。"
    },
    {
      name: "销毁栈", sig: "void DestroyStack(LinkStNode *&s)", time: "O(n)",
      code: `void DestroyStack(LinkStNode *&s) {
    LinkStNode *p = s, *q = p->next;
    while (q != NULL) {
        free(p);
        p = q;
        q = p->next;
    }
    free(p);
    s = NULL;
}`,
      tips: "链栈销毁要遍历所有结点，O(n)。"
    },
    {
      name: "判断栈空", sig: "bool StackEmpty(LinkStNode *s)", time: "O(1)",
      code: `bool StackEmpty(LinkStNode *s) {
    return (s->next == NULL);
}`,
      tips: "带头结点版本判空看首结点是否存在。"
    },
    {
      name: "进栈", sig: "void Push(LinkStNode *&s, ElemType e)", time: "O(1)",
      code: `void Push(LinkStNode *&s, ElemType e) {
    LinkStNode *p = (LinkStNode *)malloc(sizeof(LinkStNode));
    p->data = e;
    p->next = s->next;          /* 新结点指向原栈顶 */
    s->next = p;                /* 头结点指向新栈顶 */
}`,
      tips: "就是头插法，不需要判满，这是链栈相对顺序栈的优势。"
    },
    {
      name: "出栈", sig: "bool Pop(LinkStNode *&s, ElemType &e)", time: "O(1)",
      code: `bool Pop(LinkStNode *&s, ElemType &e) {
    if (s->next == NULL) return false;
    LinkStNode *p = s->next;    /* p 指向栈顶结点 */
    e = p->data;
    s->next = p->next;          /* 摘掉栈顶 */
    free(p);
    return true;
}`,
      tips: "出栈只删首结点，必须保存 p 再 free，顺序不能反。"
    },
    {
      name: "取栈顶元素", sig: "bool GetTop(LinkStNode *s, ElemType &e)", time: "O(1)",
      code: `bool GetTop(LinkStNode *s, ElemType &e) {
    if (s->next == NULL) return false;
    e = s->next->data;
    return true;
}`,
      tips: "栈顶是 s->next 的数据域，不删除结点。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "sqqueue", name: "循环队列", cat: "栈和队列",
  desc: "循环队列把数组看成首尾相接的环，用 front 指向队头元素、rear 指向队尾元素的下一个位置。为了区分队空和队满，牺牲一个存储单元：队空 front==rear，队满 (rear+1)%MaxSize==front。",
  type: `#define MaxSize 100
typedef int ElemType;
typedef struct {
    ElemType data[MaxSize];
    int front, rear;           /* 队头和队尾指针 */
} SqQueue;`,
  tips: "循环队列的四要素必须背熟：队空 front==rear；队满 (rear+1)%MaxSize==front；入队 rear=(rear+1)%MaxSize；元素个数 (rear-front+MaxSize)%MaxSize。",
  ops: [
    {
      name: "初始化队列", sig: "void InitQueue(SqQueue *&q)", time: "O(1)",
      code: `void InitQueue(SqQueue *&q) {
    q = (SqQueue *)malloc(sizeof(SqQueue));
    q->front = q->rear = 0;     /* 队空 */
}`,
      tips: "front 和 rear 初始都指向 0，不要初始化为 -1。"
    },
    {
      name: "销毁队列", sig: "void DestroyQueue(SqQueue *&q)", time: "O(1)",
      code: `void DestroyQueue(SqQueue *&q) {
    free(q);
    q = NULL;
}`,
      tips: "循环队列整体分配，一次释放即可。"
    },
    {
      name: "判断队空", sig: "bool QueueEmpty(SqQueue *q)", time: "O(1)",
      code: `bool QueueEmpty(SqQueue *q) {
    return (q->front == q->rear);
}`,
      tips: "队空条件 front==rear，注意队满不是这个条件。"
    },
    {
      name: "入队", sig: "bool enQueue(SqQueue *&q, ElemType e)", time: "O(1)",
      code: `bool enQueue(SqQueue *&q, ElemType e) {
    if ((q->rear + 1) % MaxSize == q->front) return false;  /* 队满 */
    q->rear = (q->rear + 1) % MaxSize;   /* 尾指针后移，取模成环 */
    q->data[q->rear] = e;
    return true;
}`,
      tips: "先移动 rear 再存值，取模运算是循环队列的关键。"
    },
    {
      name: "出队", sig: "bool deQueue(SqQueue *&q, ElemType &e)", time: "O(1)",
      code: `bool deQueue(SqQueue *&q, ElemType &e) {
    if (q->front == q->rear) return false;   /* 队空 */
    q->front = (q->front + 1) % MaxSize;     /* 头指针后移 */
    e = q->data[q->front];
    return true;
}`,
      tips: "front 指向的下一位置才是队头元素，所以先移再取。"
    },
    {
      name: "求队列元素个数", sig: "int QueueLength(SqQueue *q)", time: "O(1)",
      code: `int QueueLength(SqQueue *q) {
    return (q->rear - q->front + MaxSize) % MaxSize;
}`,
      tips: "加 MaxSize 再取模是为了处理 rear<front 的环形情况，这个公式必须记住。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "linkqueue", name: "链队列", cat: "栈和队列",
  desc: "链队列用带头结点的单链表实现，队头在首结点、队尾在尾结点。需要同时维护 front 和 rear 两个指针，出队时要特别处理「只剩一个结点」导致 rear 失效的情况。",
  type: `typedef int ElemType;
typedef struct qnode {
    ElemType data;
    struct qnode *next;
} DataNode;                    /* 数据结点 */
typedef struct {
    DataNode *front;           /* 队头指针 */
    DataNode *rear;            /* 队尾指针 */
} LinkQuNode;                  /* 链队列类型 */`,
  tips: "链队列出队后若队列变空，必须把 rear 重新指向头结点，否则 rear 变成野指针。",
  ops: [
    {
      name: "初始化队列", sig: "void InitQueue(LinkQuNode *&q)", time: "O(1)",
      code: `void InitQueue(LinkQuNode *&q) {
    q = (LinkQuNode *)malloc(sizeof(LinkQuNode));
    q->front = q->rear = (DataNode *)malloc(sizeof(DataNode));
    q->front->next = NULL;      /* front 和 rear 都指向头结点 */
}`,
      tips: "front 和 rear 初始都指向头结点，此时队空。"
    },
    {
      name: "销毁队列", sig: "void DestroyQueue(LinkQuNode *&q)", time: "O(n)",
      code: `void DestroyQueue(LinkQuNode *&q) {
    DataNode *p = q->front, *r;
    if (p != NULL) {
        r = p->next;
        while (r != NULL) {
            free(p);
            p = r;
            r = p->next;
        }
        free(p);                /* 释放最后的头结点 */
    }
    free(q);                    /* 释放队列结构体 */
}`,
      tips: "先释放所有数据结点（含头结点），再释放 LinkQuNode 结构体本身，两步不能合并。"
    },
    {
      name: "判断队空", sig: "bool QueueEmpty(LinkQuNode *q)", time: "O(1)",
      code: `bool QueueEmpty(LinkQuNode *q) {
    return (q->rear == q->front);
}`,
      tips: "队空时 front 和 rear 都指向头结点。"
    },
    {
      name: "入队", sig: "void enQueue(LinkQuNode *&q, ElemType e)", time: "O(1)",
      code: `void enQueue(LinkQuNode *&q, ElemType e) {
    DataNode *p = (DataNode *)malloc(sizeof(DataNode));
    p->data = e;
    p->next = NULL;
    q->rear->next = p;          /* 挂到队尾 */
    q->rear = p;                /* 更新尾指针 */
}`,
      tips: "入队只动 rear，不改 front；链队列不存在队满。"
    },
    {
      name: "出队", sig: "bool deQueue(LinkQuNode *&q, ElemType &e)", time: "O(1)",
      code: `bool deQueue(LinkQuNode *&q, ElemType &e) {
    if (q->front == q->rear) return false;   /* 队空 */
    DataNode *p = q->front->next;   /* p 指向队头结点 */
    e = p->data;
    q->front->next = p->next;       /* 摘除队头 */
    if (q->rear == p)               /* 原队列只有一个结点 */
        q->rear = q->front;         /* 修正尾指针，防止悬空 */
    free(p);
    return true;
}`,
      tips: "if (q->rear == p) 这一句是链队列最易漏的边界处理，删掉会在队列变空后出错。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "sqstring", name: "串", cat: "栈和队列",
  desc: "串用顺序存储时，用 data 数组加 length 表示。串的基本运算包括赋值、复制、求长、连接、求子串、比较和模式匹配。模式匹配的 BF 算法思想简单但效率低，KMP 利用 next 数组避免主串回溯。",
  type: `#define MaxSize 100
typedef struct {
    char data[MaxSize];        /* 存放字符 */
    int length;                /* 串长 */
} SqString;`,
  tips: "串的下标从 0 开始但题面常按 1 计序号，写求子串时要统一；KMP 的 next 数组求法是高频考点。",
  ops: [
    {
      name: "建立串", sig: "void StrAssign(SqString &s, char cstr[])", time: "O(n)",
      code: `void StrAssign(SqString &s, char cstr[]) {
    int i;
    for (i = 0; cstr[i] != '\\0'; i++)
        s.data[i] = cstr[i];
    s.length = i;               /* 串长等于实际字符数 */
}`,
      tips: "循环结束时 i 正好等于串长，不需要再 strlen。"
    },
    {
      name: "复制串", sig: "void StrCopy(SqString &s, SqString t)", time: "O(n)",
      code: `void StrCopy(SqString &s, SqString t) {
    for (int i = 0; i < t.length; i++)
        s.data[i] = t.data[i];
    s.length = t.length;
}`,
      tips: "逐字符复制，长度一起复制，不要只拷 data 忘了 length。"
    },
    {
      name: "判断串相等", sig: "bool StrEqual(SqString s, SqString t)", time: "O(n)",
      code: `bool StrEqual(SqString s, SqString t) {
    if (s.length != t.length) return false;
    for (int i = 0; i < s.length; i++)
        if (s.data[i] != t.data[i]) return false;
    return true;
}`,
      tips: "先比长度再逐字符比，长度不同可直接返回 false。"
    },
    {
      name: "求串长", sig: "int StrLength(SqString s)", time: "O(1)",
      code: `int StrLength(SqString s) {
    return s.length;
}`,
      tips: "存了 length 就是 O(1)，不存 length 才需要遍历数到 '\\0'。"
    },
    {
      name: "串连接", sig: "SqString Concat(SqString s, SqString t)", time: "O(n+m)",
      code: `SqString Concat(SqString s, SqString t) {
    SqString str;
    str.length = s.length + t.length;
    for (int i = 0; i < s.length; i++)
        str.data[i] = s.data[i];
    for (int i = 0; i < t.length; i++)
        str.data[s.length + i] = t.data[i];   /* 从 s 长度之后接着放 */
    return str;
}`,
      tips: "第二个循环的起始下标是 s.length+i，不是 i，这是最常写错的地方。"
    },
    {
      name: "求子串", sig: "SqString SubStr(SqString s, int i, int j)", time: "O(j)",
      code: `SqString SubStr(SqString s, int i, int j) {
    SqString str;
    str.length = 0;
    if (i <= 0 || i > s.length || j < 0 || i + j - 1 > s.length)
        return str;             /* 参数不合法，返回空串 */
    for (int k = i - 1; k < i + j - 1; k++)
        str.data[k - i + 1] = s.data[k];   /* 复制第 i 个起共 j 个字符 */
    str.length = j;
    return str;
}`,
      tips: "题面第 i 个字符按 1 计数，数组下标要减 1；返回空串是错误处理的约定。"
    },
    {
      name: "BF 模式匹配", sig: "int StrIndex(SqString s, SqString t)", time: "O(n*m)",
      code: `int StrIndex(SqString s, SqString t) {
    int i = 0, j = 0;
    while (i < s.length && j < t.length) {
        if (s.data[i] == t.data[j]) { i++; j++; }   /* 继续比较后继 */
        else { i = i - j + 1; j = 0; }              /* 主串回退到本轮起点后一位 */
    }
    if (j >= t.length) return i - t.length;         /* 匹配成功，返回起始下标 */
    return -1;                  /* 匹配失败 */
}`,
      tips: "失败时 i 回退到 i-j+1，j 归零；时间复杂度 O(n*m)，正是 KMP 要优化的地方。"
    },
    {
      name: "求 next 数组", sig: "void GetNext(SqString t, int next[])", time: "O(m)",
      code: `void GetNext(SqString t, int next[]) {
    int j = 0, k = -1;
    next[0] = -1;               /* 教材约定 next[0]=-1 */
    while (j < t.length - 1) {
        if (k == -1 || t.data[j] == t.data[k]) {
            j++; k++;
            next[j] = k;        /* 最长相等前后缀长度 */
        } else
            k = next[k];        /* 回溯 */
    }
}`,
      tips: "next[j] 是模式串前 j 个字符的最长相等前后缀长度，k=next[k] 的回溯是核心。"
    },
    {
      name: "KMP 模式匹配", sig: "int KMPIndex(SqString s, SqString t)", time: "O(n+m)",
      code: `int KMPIndex(SqString s, SqString t) {
    int next[MaxSize], i = 0, j = 0;
    GetNext(t, next);
    while (i < s.length && j < t.length) {
        if (j == -1 || s.data[i] == t.data[j]) { i++; j++; }
        else
            j = next[j];        /* 主串 i 不回溯，模式串右滑 */
    }
    if (j >= t.length) return i - t.length;
    return -1;
}`,
      tips: "KMP 与 BF 的唯一区别是失败时主串 i 不动、j 退到 next[j]，这是把 O(n*m) 降到 O(n+m) 的根本原因。"
    }
  ]
});

/* 代码手册 · 分片3：二叉树、线索二叉树、哈夫曼树 */
window.CODEBOOK = window.CODEBOOK || { groups: [] };

window.CODEBOOK.groups.push({
  id: "btree", name: "二叉树", cat: "树和二叉树",
  desc: "二叉树用二叉链表存储，每个结点含 data、lchild、rchild 三个域。绝大多数二叉树算法都是递归：先处理根，再递归处理左子树和右子树，只需调整三者的先后顺序就得到先序、中序、后序遍历。",
  type: `typedef char ElemType;
typedef struct node {
    ElemType data;             /* 数据元素 */
    struct node *lchild;       /* 左孩子指针 */
    struct node *rchild;       /* 右孩子指针 */
} BTNode;                      /* 二叉树结点类型 */`,
  tips: "递归算法设计的三步固定套路：明确递归出口（空树处理）、拆解为左子树和右子树的同类问题、合并结果。所有遍历与统计题都可以套。",
  ops: [
    {
      name: "括号表示法建树", sig: "void CreateBTree(BTNode *&b, char *str)", time: "O(n)",
      code: `void CreateBTree(BTNode *&b, char *str) {
    BTNode *St[MaxSize], *p = NULL;
    int top = -1, k, j = 0;
    char ch;
    b = NULL;                   /* 初始为空树 */
    ch = str[j];
    while (ch != '\\0') {
        switch (ch) {
        case '(': top++; St[top] = p; k = 1; break;  /* 准备处理左孩子 */
        case ')': top--; break;
        case ',': k = 2; break;                     /* 准备处理右孩子 */
        default:
            p = (BTNode *)malloc(sizeof(BTNode));
            p->data = ch; p->lchild = p->rchild = NULL;
            if (b == NULL) b = p;                   /* 第一个结点为根 */
            else {
                if (k == 1) St[top]->lchild = p;    /* 挂为左孩子 */
                else St[top]->rchild = p;           /* 挂为右孩子 */
            }
        }
        j++; ch = str[j];
    }
}`,
      tips: "k=1 表示下一个结点挂左孩子，k=2 挂右孩子；遇到 '(' 把当前结点压栈，遇到 ')' 弹栈回到双亲。"
    },
    {
      name: "销毁二叉树", sig: "void DestroyBTree(BTNode *&b)", time: "O(n)",
      code: `void DestroyBTree(BTNode *&b) {
    if (b != NULL) {
        DestroyBTree(b->lchild);   /* 先销毁左子树 */
        DestroyBTree(b->rchild);   /* 再销毁右子树 */
        free(b);                   /* 最后释放根结点，即后序遍历顺序 */
    }
}`,
      tips: "必须后序销毁：先递归释放子树，最后释放自己，否则释放根后访问不到子树。"
    },
    {
      name: "查找结点", sig: "BTNode *FindNode(BTNode *b, ElemType x)", time: "O(n)",
      code: `BTNode *FindNode(BTNode *b, ElemType x) {
    BTNode *p;
    if (b == NULL) return NULL;            /* 递归出口 */
    if (b->data == x) return b;            /* 找到返回 */
    p = FindNode(b->lchild, x);            /* 找左子树 */
    if (p != NULL) return p;
    return FindNode(b->rchild, x);         /* 左子树没找到再找右子树 */
}`,
      tips: "先找左子树，找到就返回，不再找右子树；返回值是指针，找不到统一返回 NULL。"
    },
    {
      name: "求树高度", sig: "int BTHeight(BTNode *b)", time: "O(n)",
      code: `int BTHeight(BTNode *b) {
    int lchildh, rchildh;
    if (b == NULL) return 0;               /* 空树高度为 0 */
    lchildh = BTHeight(b->lchild);         /* 左子树高度 */
    rchildh = BTHeight(b->rchild);         /* 右子树高度 */
    return (lchildh > rchildh) ? (lchildh + 1) : (rchildh + 1);
}`,
      tips: "树高 = max(左子树高, 右子树高) + 1，空树为 0 不是 1，这个基准经常和结点数搞混。"
    },
    {
      name: "求结点个数", sig: "int NodeCount(BTNode *b)", time: "O(n)",
      code: `int NodeCount(BTNode *b) {
    if (b == NULL) return 0;
    return NodeCount(b->lchild) + NodeCount(b->rchild) + 1;   /* 左 + 右 + 根 */
}`,
      tips: "空树 0 个，否则左子树数 + 右子树数 + 根结点 1 个。"
    },
    {
      name: "求叶子结点数", sig: "int LeafCount(BTNode *b)", time: "O(n)",
      code: `int LeafCount(BTNode *b) {
    if (b == NULL) return 0;
    if (b->lchild == NULL && b->rchild == NULL) return 1;    /* 叶子判定 */
    return LeafCount(b->lchild) + LeafCount(b->rchild);
}`,
      tips: "叶子条件是左右孩子都为空，只判一边是最常见的错误。"
    },
    {
      name: "输出二叉树", sig: "void DispBTree(BTNode *b)", time: "O(n)",
      code: `void DispBTree(BTNode *b) {
    if (b != NULL) {
        printf("%c", b->data);
        if (b->lchild != NULL || b->rchild != NULL) {
            printf("(");
            DispBTree(b->lchild);              /* 递归输出左子树 */
            if (b->rchild != NULL) printf(",");
            DispBTree(b->rchild);              /* 递归输出右子树 */
            printf(")");
        }
    }
}`,
      tips: "输出格式就是建树的逆过程（括号表示法），可用于自检建树结果。"
    },
    {
      name: "先序遍历（递归）", sig: "void PreOrder(BTNode *b)", time: "O(n)",
      code: `void PreOrder(BTNode *b) {
    if (b != NULL) {
        printf("%c ", b->data);    /* 根 */
        PreOrder(b->lchild);       /* 左 */
        PreOrder(b->rchild);       /* 右 */
    }
}`,
      tips: "根-左-右。三种遍历代码完全一样，只是 printf 的位置不同，这是理解遍历的关键。"
    },
    {
      name: "中序遍历（递归）", sig: "void InOrder(BTNode *b)", time: "O(n)",
      code: `void InOrder(BTNode *b) {
    if (b != NULL) {
        InOrder(b->lchild);        /* 左 */
        printf("%c ", b->data);    /* 根 */
        InOrder(b->rchild);        /* 右 */
    }
}`,
      tips: "左-根-右。二叉排序树的中序序列是递增有序的，这个性质在查找章反复用。"
    },
    {
      name: "后序遍历（递归）", sig: "void PostOrder(BTNode *b)", time: "O(n)",
      code: `void PostOrder(BTNode *b) {
    if (b != NULL) {
        PostOrder(b->lchild);      /* 左 */
        PostOrder(b->rchild);      /* 右 */
        printf("%c ", b->data);    /* 根 */
    }
}`,
      tips: "左-右-根。后序序列的最后一个结点一定是根，用于由中序+后序还原二叉树。"
    },
    {
      name: "中序遍历（非递归）", sig: "void InOrder1(BTNode *b)", time: "O(n)",
      code: `void InOrder1(BTNode *b) {
    BTNode *St[MaxSize], *p;
    int top = -1;
    if (b != NULL) {
        p = b;
        while (top > -1 || p != NULL) {
            while (p != NULL) {    /* 一路向左，途经结点入栈 */
                top++; St[top] = p;
                p = p->lchild;
            }
            if (top > -1) {
                p = St[top]; top--;   /* 弹出栈顶访问 */
                printf("%c ", p->data);
                p = p->rchild;        /* 转向右子树 */
            }
        }
        printf("\\n");
    }
}`,
      tips: "非递归中序用栈模拟递归：先压所有左孩子，弹出访问后再转向右子树。这是用栈替代递归的标准模板。"
    },
    {
      name: "层次遍历", sig: "void LevelOrder(BTNode *b)", time: "O(n)",
      code: `void LevelOrder(BTNode *b) {
    BTNode *p;
    SqQueue *qu;
    InitQueue(qu);                  /* 用循环队列 */
    if (b != NULL) enQueue(qu, b);  /* 根结点先入队 */
    while (!QueueEmpty(qu)) {
        deQueue(qu, p);             /* 出队并访问 */
        printf("%c ", p->data);
        if (p->lchild != NULL) enQueue(qu, p->lchild);   /* 左孩子入队 */
        if (p->rchild != NULL) enQueue(qu, p->rchild);   /* 右孩子入队 */
    }
    DestroyQueue(qu);
}`,
      tips: "层次遍历靠队列：出队即访问，同时把左右孩子入队。求二叉树宽度也是这个框架。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "threadtree", name: "线索二叉树", cat: "树和二叉树",
  desc: "线索二叉树利用二叉链表中的空指针域存放遍历前驱和后继的线索。加上 ltag、rtag 标志位区分「孩子」和「线索」，从而在不用栈的情况下也能遍历，且能直接找到某结点的前驱后继。",
  type: `typedef char ElemType;
typedef struct node {
    ElemType data;
    int ltag, rtag;            /* 0 表示孩子，1 表示线索 */
    struct node *lchild, *rchild;
} TBTNode;                     /* 线索二叉树结点 */`,
  tips: "线索化本质上是把遍历过程「走一遍并填空」，所以中序线索化代码就是中序遍历，把 printf 换成填指针。",
  ops: [
    {
      name: "中序线索化", sig: "void Thread(TBTNode *&p)", time: "O(n)",
      code: `TBTNode *pre;                  /* 全局变量，指向前驱 */

void Thread(TBTNode *&p) {
    if (p != NULL) {
        Thread(p->lchild);              /* 左子树线索化 */
        if (p->lchild == NULL) {        /* 左孩子为空，建前驱线索 */
            p->lchild = pre;
            p->ltag = 1;
        } else p->ltag = 0;
        if (pre->rchild == NULL) {      /* 前驱右孩子为空，建后继线索 */
            pre->rchild = p;
            pre->rtag = 1;
        } else pre->rtag = 0;
        pre = p;                        /* pre 后移 */
        Thread(p->rchild);              /* 右子树线索化 */
    }
}`,
      tips: "pre 记录刚访问过的结点，因此建立的是「pre 的后继」和「p 的前驱」两条线索，两者要成对写。"
    },
    {
      name: "建立中序线索树", sig: "TBTNode *CreateThread(TBTNode *b)", time: "O(n)",
      code: `TBTNode *CreateThread(TBTNode *b) {
    TBTNode *root = (TBTNode *)malloc(sizeof(TBTNode));
    root->ltag = 0; root->rtag = 1;     /* 头结点：左指向根，右指向末结点 */
    root->rchild = b;                   /* 先暂存根，线索化后再改 */
    if (b == NULL) root->lchild = root;
    else {
        root->lchild = b;
        pre = root;                     /* 头结点作为第一个前驱 */
        Thread(b);
        pre->rchild = root;             /* 最后一个结点后继指向头结点 */
        pre->rtag = 1;
        root->rchild = pre;             /* 头结点右指针指向最后一个结点 */
    }
    return root;
}`,
      tips: "加头结点形成循环线索链表，遍历时不必判空，哨兵技巧让代码更简洁。"
    },
    {
      name: "中序遍历线索树", sig: "void ThInOrder(TBTNode *tb)", time: "O(n)",
      code: `void ThInOrder(TBTNode *tb) {
    TBTNode *p = tb->lchild;           /* p 指向根结点 */
    while (p != tb) {
        while (p->ltag == 0) p = p->lchild;   /* 一路向左找中序首结点 */
        printf("%c ", p->data);
        while (p->rtag == 1 && p->rchild != tb) {  /* 顺着后继线索走 */
            p = p->rchild;
            printf("%c ", p->data);
        }
        p = p->rchild;                 /* 转向右子树 */
    }
}`,
      tips: "线索遍历无需栈，空间 O(1)：向左走到头就访问，再用 rtag 线索连续跳到后继。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "huffman", name: "哈夫曼树", cat: "树和二叉树",
  desc: "哈夫曼树是带权路径长度 WPL 最小的二叉树。构造方法是每次从森林中选两棵权值最小的树合并，新结点权值为两者之和。由它得到的编码是前缀编码，用于数据压缩。",
  type: `#define N 50
#define M 2*N-1
typedef struct {
    char data;                 /* 结点值，仅叶子使用 */
    double weight;             /* 权值 */
    int parent;                /* 双亲下标 */
    int lchild, rchild;        /* 左右孩子下标 */
} HTNode;                      /* 哈夫曼树结点（数组存储）`,
  tips: "n 个叶子构造出的哈夫曼树共 2n-1 个结点；编码方向是「左 0 右 1」，从叶子逆推到根再反转。",
  ops: [
    {
      name: "构造哈夫曼树", sig: "void CreateHT(HTNode ht[], int n)", time: "O(n²)",
      code: `void CreateHT(HTNode ht[], int n) {
    int i, k, lnode, rnode;
    double min1, min2;
    for (i = 0; i < 2 * n - 1; i++)         /* 全部结点初始化 */
        ht[i].parent = ht[i].lchild = ht[i].rchild = -1;
    for (i = n; i < 2 * n - 1; i++) {       /* 构造 n-1 个内部结点 */
        min1 = min2 = 32767; lnode = rnode = -1;
        for (k = 0; k <= i - 1; k++) {      /* 找两个权值最小且无双亲的结点 */
            if (ht[k].parent == -1) {
                if (ht[k].weight < min1) {
                    min2 = min1; rnode = lnode;
                    min1 = ht[k].weight; lnode = k;
                } else if (ht[k].weight < min2) {
                    min2 = ht[k].weight; rnode = k;
                }
            }
        }
        ht[lnode].parent = ht[rnode].parent = i;  /* 合并为一棵新树 */
        ht[i].weight = ht[lnode].weight + ht[rnode].weight;
        ht[i].lchild = lnode; ht[i].rchild = rnode;
    }
}`,
      tips: "min1 和 min2 的更新顺序很容易写错：新最小值出现时，原 min1 要下移成 min2，否则会丢掉第二小。"
    },
    {
      name: "求哈夫曼编码", sig: "void CreateHCode(HTNode ht[], HCode hcd[], int n)", time: "O(n²)",
      code: `void CreateHCode(HTNode ht[], HCode hcd[], int n) {
    int i, f, c;
    HCode hc;
    for (i = 0; i < n; i++) {              /* 对每个叶子求编码 */
        hc.start = n; hc.cd[hc.start] = '\\0';
        c = i; f = ht[i].parent;
        while (f != -1) {                  /* 从叶子向上回溯到根 */
            if (ht[f].lchild == c) hc.cd[--hc.start] = '0';  /* 左孩子记 0 */
            else hc.cd[--hc.start] = '1';                    /* 右孩子记 1 */
            c = f; f = ht[f].parent;
        }
        hcd[i] = hc;
    }
}`,
      tips: "编码数组从后往前填，因为回溯方向是叶子→根，得到的是逆序，start 最终指向编码起点。"
    },
    {
      name: "求带权路径长度", sig: "double WPL(HTNode ht[], int n)", time: "O(n²)",
      code: `double WPL(HTNode ht[], int n) {
    double sum = 0;
    for (int i = 0; i < n; i++) {          /* 只累加叶子 */
        int depth = 0, c = i, f = ht[i].parent;
        while (f != -1) { depth++; c = f; f = ht[f].parent; }
        sum += ht[i].weight * depth;       /* 权值 × 路径长度 */
    }
    return sum;
}`,
      tips: "WPL 等于所有叶子权值与深度乘积之和；只有叶子计入，内部结点不计。"
    }
  ]
});

/* 代码手册 · 分片4：图的存储与经典算法 */
window.CODEBOOK = window.CODEBOOK || { groups: [] };

window.CODEBOOK.groups.push({
  id: "graphstore", name: "图的存储", cat: "图",
  desc: "图有邻接矩阵和邻接表两种主流存储。邻接矩阵适合稠密图，判断两点是否相邻 O(1)，空间 O(n²)；邻接表适合稀疏图，空间 O(n+e)，但判断相邻要遍历链表。考试要求两种都能手写出来，并会互相转换。",
  type: `#define MAXV 100
#define INF 32767              /* 无穷大，表示不相邻 */
typedef int InfoType;

/* ---- 邻接矩阵 ---- */
typedef struct {
    int edges[MAXV][MAXV];     /* 邻接矩阵 */
    int n, e;                  /* 顶点数、边数 */
} MatGraph;

/* ---- 邻接表 ---- */
typedef struct ANode {
    int adjvex;                /* 该边指向的顶点编号 */
    struct ANode *nextarc;     /* 指向下一条边 */
    InfoType weight;           /* 权值 */
} ArcNode;                     /* 边结点 */
typedef struct Vnode {
    InfoType info;             /* 顶点信息 */
    ArcNode *firstarc;         /* 指向第一条边 */
} VNode;                       /* 顶点结点 */
typedef struct {
    VNode adjlist[MAXV];       /* 顶点数组 */
    int n, e;
} AdjGraph;`,
  tips: "无向图的邻接矩阵是对称的，第 i 行非零元素个数就是顶点 i 的度；有向图第 i 行之和是出度、第 i 列之和是入度。",
  ops: [
    {
      name: "由数组建立邻接矩阵", sig: "void CreateMat(MatGraph &g, int A[MAXV][MAXV], int n, int e)", time: "O(n²)",
      code: `void CreateMat(MatGraph &g, int A[MAXV][MAXV], int n, int e) {
    g.n = n; g.e = e;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            g.edges[i][j] = A[i][j];
}`,
      tips: "建图本身是复制矩阵，注意无边用 INF 而不是 0（与邻接表算法保持一致）。"
    },
    {
      name: "由数组建立邻接表", sig: "void CreateAdj(AdjGraph *&G, int A[MAXV][MAXV], int n, int e)", time: "O(n²)",
      code: `void CreateAdj(AdjGraph *&G, int A[MAXV][MAXV], int n, int e) {
    ArcNode *p;
    G = (AdjGraph *)malloc(sizeof(AdjGraph));
    for (int i = 0; i < n; i++) G->adjlist[i].firstarc = NULL;
    for (int i = 0; i < n; i++)
        for (int j = n - 1; j >= 0; j--)       /* 倒序插入使链表按顶点号递增 */
            if (A[i][j] != 0 && A[i][j] != INF) {
                p = (ArcNode *)malloc(sizeof(ArcNode));
                p->adjvex = j; p->weight = A[i][j];
                p->nextarc = G->adjlist[i].firstarc;
                G->adjlist[i].firstarc = p;   /* 头插法 */
            }
    G->n = n; G->e = e;
}`,
      tips: "头插法会逆序，所以内层循环从 n-1 倒着扫，这样链表正好是按顶点号从小到大排列。"
    },
    {
      name: "销毁邻接表", sig: "void DestroyAdj(AdjGraph *&G)", time: "O(n+e)",
      code: `void DestroyAdj(AdjGraph *&G) {
    ArcNode *pre, *p;
    for (int i = 0; i < G->n; i++) {
        pre = G->adjlist[i].firstarc;
        while (pre != NULL) {
            p = pre->nextarc;
            free(pre);
            pre = p;
        }
    }
    free(G); G = NULL;
}`,
      tips: "先释放每条边，再释放整体结构体，两层循环不能颠倒。"
    },
    {
      name: "邻接矩阵转邻接表", sig: "void MatToList(MatGraph g, AdjGraph *&G)", time: "O(n²)",
      code: `void MatToList(MatGraph g, AdjGraph *&G) {
    ArcNode *p;
    G = (AdjGraph *)malloc(sizeof(AdjGraph));
    for (int i = 0; i < g.n; i++) G->adjlist[i].firstarc = NULL;
    for (int i = 0; i < g.n; i++)
        for (int j = g.n - 1; j >= 0; j--)
            if (g.edges[i][j] != 0 && g.edges[i][j] != INF) {
                p = (ArcNode *)malloc(sizeof(ArcNode));
                p->adjvex = j; p->weight = g.edges[i][j];
                p->nextarc = G->adjlist[i].firstarc;
                G->adjlist[i].firstarc = p;
            }
    G->n = g.n; G->e = g.e;
}`,
      tips: "转换题的关键是把矩阵的每个非零元素变成一条边结点，空间从 O(n²) 降到 O(n+e)。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "graphalgo", name: "图的应用算法", cat: "图",
  desc: "图这一章的算法题集中在遍历、最小生成树、最短路径、拓扑排序与关键路径。前四个都要能按邻接矩阵或邻接表手写，拓扑排序与关键路径的思想比代码更重要。",
  type: `/* 全局访问标记，DFS 与 BFS 共用 */
int visited[MAXV] = {0};`,
  tips: "遍历类算法都要先清空 visited；Prim 与 Dijkstra 都维护 lowcost/dist 数组记录「当前最优」，结构高度相似，可以对比记忆。",
  ops: [
    {
      name: "深度优先遍历 DFS", sig: "void DFS(AdjGraph *G, int v)", time: "O(n+e)",
      code: `void DFS(AdjGraph *G, int v) {
    ArcNode *p;
    printf("%d ", v);          /* 访问顶点 v */
    visited[v] = 1;            /* 置已访问标记 */
    p = G->adjlist[v].firstarc;
    while (p != NULL) {        /* 遍历所有邻接点 */
        if (visited[p->adjvex] == 0)
            DFS(G, p->adjvex);  /* 未访问的递归访问 */
        p = p->nextarc;
    }
}`,
      tips: "邻接表 DFS 的时间是 O(n+e)；用邻接矩阵则是 O(n²)，因为矩阵要扫描整行。"
    },
    {
      name: "广度优先遍历 BFS", sig: "void BFS(AdjGraph *G, int v)", time: "O(n+e)",
      code: `void BFS(AdjGraph *G, int v) {
    ArcNode *p;
    SqQueue *qu;
    InitQueue(qu);
    int visited[MAXV] = {0};
    printf("%d ", v); visited[v] = 1;
    enQueue(qu, v);
    while (!QueueEmpty(qu)) {
        int w; deQueue(qu, w);
        p = G->adjlist[w].firstarc;
        while (p != NULL) {
            if (visited[p->adjvex] == 0) {   /* 未访问则访问并入队 */
                printf("%d ", p->adjvex);
                visited[p->adjvex] = 1;
                enQueue(qu, p->adjvex);
            }
            p = p->nextarc;
        }
    }
}`,
      tips: "BFS 用队列：出队一个顶点，把它所有未访问的邻接点访问并全部入队。注意「入队时就标记已访问」。"
    },
    {
      name: "Prim 最小生成树", sig: "void Prim(MatGraph g, int v)", time: "O(n²)",
      code: `void Prim(MatGraph g, int v) {
    int lowcost[MAXV], closest[MAXV], i, j, k, min;
    for (i = 0; i < g.n; i++) {          /* 初始化：从顶点 v 出发 */
        lowcost[i] = g.edges[v][i];
        closest[i] = v;
    }
    for (i = 1; i < g.n; i++) {          /* 找 n-1 条边 */
        min = INF; k = -1;
        for (j = 0; j < g.n; j++)        /* 找最小的 lowcost */
            if (lowcost[j] != 0 && lowcost[j] < min) {
                min = lowcost[j]; k = j;
            }
        printf("边(%d,%d) 权为%d\\n", closest[k], k, min);
        lowcost[k] = 0;                  /* 0 表示已加入生成树 */
        for (j = 0; j < g.n; j++)        /* 用新顶点修正 lowcost */
            if (lowcost[j] != 0 && g.edges[k][j] < lowcost[j]) {
                lowcost[j] = g.edges[k][j];
                closest[j] = k;
            }
    }
}`,
      tips: "lowcost[j]=0 标记已入树，后面两处判断都要写 !=0，漏掉会把已选顶点再选一次。时间复杂度 O(n²)，与边数无关。"
    },
    {
      name: "Kruskal 最小生成树", sig: "void Kruskal(MatGraph g)", time: "O(e log e)",
      code: `typedef struct {
    int u, v, w;               /* 边的起点、终点、权值 */
} Edge;

void Kruskal(MatGraph g) {
    Edge E[MAXV * MAXV]; int cnt = 0;
    int vset[MAXV];
    for (int i = 0; i < g.n; i++) vset[i] = i;        /* 并查集初始化 */
    for (int i = 0; i < g.n; i++)                    /* 收集所有边 */
        for (int j = i + 1; j < g.n; j++)
            if (g.edges[i][j] != 0 && g.edges[i][j] != INF) {
                E[cnt].u = i; E[cnt].v = j;
                E[cnt].w = g.edges[i][j]; cnt++;
            }
    /* 按权值升序排序（此处省略，考试可写「对 E 按 w 排序」） */
    for (int k = 0; k < cnt; k++) {
        int a = E[k].u, b = E[k].v;
        if (vset[a] != vset[b]) {                     /* 不构成回路才选 */
            printf("边(%d,%d) 权为%d\\n", a, b, E[k].w);
            int old = vset[b];
            for (int i = 0; i < g.n; i++)             /* 合并两个集合 */
                if (vset[i] == old) vset[i] = vset[a];
        }
    }
}`,
      tips: "Kruskal 是按边权从小到大选边，用并查集判环；适合稀疏图，时间复杂度 O(e log e)。"
    },
    {
      name: "Dijkstra 单源最短路径", sig: "void Dijkstra(MatGraph g, int v)", time: "O(n²)",
      code: `void Dijkstra(MatGraph g, int v) {
    int dist[MAXV], path[MAXV], S[MAXV];
    int i, j, k, min;
    for (i = 0; i < g.n; i++) {          /* 初始化 */
        dist[i] = g.edges[v][i];
        S[i] = 0;
    }
    S[v] = 1;                            /* 源点加入 S 集 */
    for (i = 1; i < g.n; i++) {
        min = INF; k = -1;
        for (j = 0; j < g.n; j++)        /* 选当前 dist 最小的顶点 */
            if (S[j] == 0 && dist[j] < min) { min = dist[j]; k = j; }
        if (k == -1) break;
        S[k] = 1;                        /* 加入 S 集 */
        for (j = 0; j < g.n; j++)        /* 以 k 为跳板松弛 */
            if (S[j] == 0 && g.edges[k][j] != INF
                && dist[k] + g.edges[k][j] < dist[j]) {
                dist[j] = dist[k] + g.edges[k][j];
                path[j] = k;
            }
    }
}`,
      tips: "Dijkstra 与 Prim 只差松弛方式：Prim 比的是边权 g.edges[k][j]，Dijkstra 比的是路径长 dist[k]+g.edges[k][j]。"
    },
    {
      name: "Floyd 每对顶点最短路径", sig: "void Floyd(MatGraph g)", time: "O(n³)",
      code: `void Floyd(MatGraph g) {
    int A[MAXV][MAXV], path[MAXV][MAXV];
    int i, j, k;
    for (i = 0; i < g.n; i++)
        for (j = 0; j < g.n; j++) {
            A[i][j] = g.edges[i][j];
            if (i != j && g.edges[i][j] < INF) path[i][j] = i;
            else path[i][j] = -1;
        }
    for (k = 0; k < g.n; k++)            /* 依次以每个顶点作中转 */
        for (i = 0; i < g.n; i++)
            for (j = 0; j < g.n; j++)
                if (A[i][j] > A[i][k] + A[k][j]) {   /* 经 k 更短则更新 */
                    A[i][j] = A[i][k] + A[k][j];
                    path[i][j] = path[k][j];
                }
}`,
      tips: "三层循环中 k 必须写在最外层，这是动态规划的阶段划分，写在内层结果就错了。"
    },
    {
      name: "拓扑排序", sig: "bool TopSort(AdjGraph *G)", time: "O(n+e)",
      code: `bool TopSort(AdjGraph *G) {
    int indegree[MAXV] = {0}, St[MAXV], top = -1;
    ArcNode *p;
    for (int i = 0; i < G->n; i++)       /* 统计各顶点入度 */
        for (p = G->adjlist[i].firstarc; p; p = p->nextarc)
            indegree[p->adjvex]++;
    for (int i = 0; i < G->n; i++)       /* 入度为 0 的入栈 */
        if (indegree[i] == 0) St[++top] = i;
    int cnt = 0;
    while (top > -1) {
        int i = St[top--];               /* 取一个入度为 0 的顶点 */
        printf("%d ", i); cnt++;
        for (p = G->adjlist[i].firstarc; p; p = p->nextarc)
            if (--indegree[p->adjvex] == 0)   /* 后继入度减 1 */
                St[++top] = p->adjvex;
    }
    return cnt == G->n;                  /* 输出数不足 n 说明有回路 */
}`,
      tips: "最后 return cnt==n 是判「是否存在回路」的关键；拓扑序列不唯一，用不同的栈或队列会得到不同结果。"
    },
    {
      name: "关键路径", sig: "void CriticalPath(AdjGraph *G)", time: "O(n+e)",
      code: `void CriticalPath(AdjGraph *G) {
    int ve[MAXV] = {0}, vl[MAXV], indegree[MAXV] = {0};
    int topo[MAXV], top = -1, cnt = 0;
    ArcNode *p;
    for (int i = 0; i < G->n; i++)
        for (p = G->adjlist[i].firstarc; p; p = p->nextarc)
            indegree[p->adjvex]++;
    for (int i = 0; i < G->n; i++)
        if (indegree[i] == 0) topo[++top] = i;
    while (top > -1) {                   /* 拓扑序求最早发生时间 ve */
        int i = topo[top--]; cnt++;
        for (p = G->adjlist[i].firstarc; p; p = p->nextarc) {
            int j = p->adjvex;
            if (ve[i] + p->weight > ve[j]) ve[j] = ve[i] + p->weight;
            if (--indegree[j] == 0) topo[++top] = j;
        }
    }
    if (cnt < G->n) return;              /* 有回路，无关键路径 */
    for (int i = 0; i < G->n; i++) vl[i] = ve[G->n - 1];   /* 汇点初始化 */
    for (int k = cnt - 1; k >= 0; k--) {  /* 逆拓扑序求最迟发生时间 vl */
        int i = topo[k];
        for (p = G->adjlist[i].firstarc; p; p = p->nextarc) {
            int j = p->adjvex;
            if (vl[j] - p->weight < vl[i]) vl[i] = vl[j] - p->weight;
        }
    }
    for (int i = 0; i < G->n; i++)       /* 找关键活动：e==l */
        for (p = G->adjlist[i].firstarc; p; p = p->nextarc) {
            int e = ve[i], l = vl[p->adjvex] - p->weight;
            if (e == l) printf("关键活动 <%d,%d>\\n", i, p->adjvex);
        }
}`,
      tips: "ve 用拓扑序正推取 max，vl 用逆拓扑序倒推取 min；活动的最早开始 e=ve[i]，最迟开始 l=vl[j]-w，e==l 即关键活动。",
      }
  ]
});

/* 代码手册 · 分片5：查找 */
window.CODEBOOK = window.CODEBOOK || { groups: [] };

window.CODEBOOK.groups.push({
  id: "seqsearch", name: "顺序查找与折半查找", cat: "查找",
  desc: "顺序查找对表无要求，从一端扫到另一端，ASL=(n+1)/2；折半查找要求表有序且顺序存储，每比较一次范围减半，ASL≈log₂(n+1)-1，但只适用于静态查找表。",
  type: `typedef int KeyType;
typedef struct {
    KeyType key;               /* 关键字 */
    InfoType data;             /* 其他数据 */
} RecType;                     /* 查找表元素类型 */`,
  tips: "顺序查找成功 ASL=(n+1)/2，折半查找的判定树高度是 ⌈log₂(n+1)⌉，这几个数值题必须能秒算。",
  ops: [
    {
      name: "顺序查找", sig: "int SeqSearch(RecType R[], int n, KeyType k)", time: "O(n)",
      code: `int SeqSearch(RecType R[], int n, KeyType k) {
    int i = 0;
    while (i < n && R[i].key != k)   /* 从前往后逐个比较 */
        i++;
    if (i >= n) return 0;            /* 未找到，返回 0 */
    return i + 1;                    /* 返回逻辑序号 */
}`,
      tips: "哨兵版把 R[0] 存关键字可以从头往后写 while(R[i].key!=k) i--，代码更短，考试两种都认。"
    },
    {
      name: "折半查找", sig: "int BinSearch(RecType R[], int n, KeyType k)", time: "O(log n)",
      code: `int BinSearch(RecType R[], int n, KeyType k) {
    int low = 0, high = n - 1, mid;
    while (low <= high) {
        mid = (low + high) / 2;
        if (R[mid].key == k) return mid + 1;   /* 找到 */
        if (R[mid].key < k) low = mid + 1;     /* 去右半区 */
        else high = mid - 1;                   /* 去左半区 */
    }
    return 0;                        /* 未找到 */
}`,
      tips: "循环条件是 low<=high（有等号），否则会漏掉最后一个元素；比较失败后 mid 要 ±1，不能留在原区间。"
    },
    {
      name: "分块查找", sig: "int IdxSearch(IDX I[], int b, RecType R[], int n, KeyType k)", time: "O(√n)",
      code: `typedef struct {
    KeyType key;               /* 块内最大关键字 */
    int link;                  /* 块起始下标 */
} IDX;                         /* 索引项 */

int IdxSearch(IDX I[], int b, RecType R[], int n, KeyType k) {
    int s = n / b, i;                   /* s 为每块元素个数 */
    int low = 0, high = b - 1, mid;
    while (low <= high) {               /* 先折半查索引表，定位块 */
        mid = (low + high) / 2;
        if (I[mid].key >= k) high = mid - 1;
        else low = mid + 1;
    }
    if (low >= b) return 0;
    i = I[low].link;                    /* 块起始下标 */
    while (i <= I[low].link + s - 1 && R[i].key != k)
        i++;                            /* 块内顺序查找 */
    if (i <= I[low].link + s - 1) return i + 1;
    return 0;
}`,
      tips: "分块查找是「索引表折半 + 块内顺序」的组合，ASL 等于两者之和，因此性能介于顺序与折半之间。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "bst", name: "二叉排序树", cat: "查找",
  desc: "二叉排序树（BST）满足左子树所有结点小于根、右子树所有结点大于根。对它做中序遍历得到递增序列。查找、插入的平均时间是 O(log n)，但插入有序序列会退化成单支树，退化为 O(n)，这正是引入平衡二叉树的原因。",
  type: `typedef int KeyType;
typedef struct node {
    KeyType key;
    InfoType data;
    struct node *lchild, *rchild;
} BSTNode;                     /* 二叉排序树结点 */`,
  tips: "二叉排序树的插入一定插在叶子位置，因此建树不需要调整结构；删除才是难点，分叶子、单孩子、双孩子三种情况。",
  ops: [
    {
      name: "插入结点", sig: "bool InsertBST(BSTNode *&bt, KeyType k)", time: "O(log n)",
      code: `bool InsertBST(BSTNode *&bt, KeyType k) {
    if (bt == NULL) {                  /* 找到空位置，新建结点 */
        bt = (BSTNode *)malloc(sizeof(BSTNode));
        bt->key = k;
        bt->lchild = bt->rchild = NULL;
        return true;
    } else if (k == bt->key)
        return false;                  /* 已存在，不插入 */
    else if (k < bt->key)
        return InsertBST(bt->lchild, k);   /* 插入左子树 */
    else
        return InsertBST(bt->rchild, k);   /* 插入右子树 */
}`,
      tips: "重复关键字直接返回 false，保证 BST 中没有重复元素，这是插入算法的隐含约定。"
    },
    {
      name: "由数组构造二叉排序树", sig: "BSTNode *CreateBST(KeyType A[], int n)", time: "O(n log n)",
      code: `BSTNode *CreateBST(KeyType A[], int n) {
    BSTNode *bt = NULL;                /* 初始为空树 */
    int i = 0;
    while (i < n) {
        InsertBST(bt, A[i]);           /* 逐个插入 */
        i++;
    }
    return bt;
}`,
      tips: "构造就是反复调用插入；输入序列的顺序会影响树的形状，但中序序列始终相同。"
    },
    {
      name: "查找结点", sig: "BSTNode *SearchBST(BSTNode *bt, KeyType k)", time: "O(log n)",
      code: `BSTNode *SearchBST(BSTNode *bt, KeyType k) {
    if (bt == NULL || bt->key == k)    /* 空树或找到 */
        return bt;
    if (k < bt->key) return SearchBST(bt->lchild, k);
    return SearchBST(bt->rchild, k);
}`,
      tips: "递归版与非递归版等价；比较次数等于结点所在层次，最好 O(log n)、最坏 O(n)。"
    },
    {
      name: "删除结点", sig: "bool DeleteBST(BSTNode *&bt, KeyType k)", time: "O(log n)",
      code: `bool DeleteBST(BSTNode *&bt, KeyType k) {
    if (bt == NULL) return false;
    if (k < bt->key) return DeleteBST(bt->lchild, k);
    if (k > bt->key) return DeleteBST(bt->rchild, k);
    /* 找到待删结点 bt，分三种情况 */
    if (bt->lchild == NULL && bt->rchild == NULL) {   /* ① 叶子 */
        free(bt); bt = NULL; return true;
    }
    if (bt->lchild == NULL) {          /* ② 只有右子树 */
        BSTNode *p = bt; bt = bt->rchild; free(p); return true;
    }
    if (bt->rchild == NULL) {          /* ② 只有左子树 */
        BSTNode *p = bt; bt = bt->lchild; free(p); return true;
    }
    /* ③ 左右子树都有：用左子树中最大结点替换 */
    BSTNode *q = bt->lchild, *pre = bt;
    while (q->rchild != NULL) { pre = q; q = q->rchild; }
    bt->key = q->key;                  /* 复制值后转为删除 q */
    if (pre == bt) pre->lchild = q->lchild;
    else pre->rchild = q->lchild;
    free(q);
    return true;
}`,
      tips: "双孩子情况有两种等价做法：用左子树最大结点或右子树最小结点替换，替换后转成删除单孩子结点。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "avl", name: "平衡二叉树", cat: "查找",
  desc: "平衡二叉树（AVL）要求任一结点左右子树高度差不超过 1。插入或删除导致失衡时，通过 LL、RR、LR、RL 四种旋转恢复平衡。旋转的本质是保持中序序列不变的前提下调整树形。",
  type: `typedef struct node {
    KeyType key;
    int bf;                        /* 平衡因子：左高 - 右高 */
    struct node *lchild, *rchild;
} AVLNode;`,
  tips: "四种失衡判断看「新结点插在失衡结点的哪一侧的子树的哪一侧」：左左→LL、右右→RR、左右→LR、右左→RL。LR 和 RL 是双旋，要先对子树反向旋转。",
  ops: [
    {
      name: "LL 型旋转（右单旋）", sig: "AVLNode *LLRotate(AVLNode *A)", time: "O(1)",
      code: `AVLNode *LLRotate(AVLNode *A) {
    AVLNode *B = A->lchild;        /* B 为 A 的左孩子 */
    A->lchild = B->rchild;         /* B 的右子树挂到 A 的左边 */
    B->rchild = A;                 /* A 成为 B 的右孩子 */
    return B;                      /* B 上升为新的子树根 */
}`,
      tips: "LL 型是「左孩子的左子树过高」，做一次右旋即可，旋转后中序序列不变。"
    },
    {
      name: "RR 型旋转（左单旋）", sig: "AVLNode *RRRotate(AVLNode *A)", time: "O(1)",
      code: `AVLNode *RRRotate(AVLNode *A) {
    AVLNode *B = A->rchild;        /* B 为 A 的右孩子 */
    A->rchild = B->lchild;         /* B 的左子树挂到 A 的右边 */
    B->lchild = A;                 /* A 成为 B 的左孩子 */
    return B;
}`,
      tips: "RR 与 LL 完全对称，把所有 lchild 和 rchild 互换即可。"
    },
    {
      name: "LR 型旋转（先左后右）", sig: "AVLNode *LRRotate(AVLNode *A)", time: "O(1)",
      code: `AVLNode *LRRotate(AVLNode *A) {
    AVLNode *B = A->lchild, *C = B->rchild;
    B->rchild = C->lchild;         /* ① 先对 B 左旋 */
    C->lchild = B;
    A->lchild = C->rchild;         /* ② 再对 A 右旋 */
    C->rchild = A;
    return C;                      /* C 成为新的子树根 */
}`,
      tips: "LR = 先对左孩子做左旋（变成 LL），再对根做右旋；写代码时可分别调用 RR 和 LL 两个函数。"
    },
    {
      name: "RL 型旋转（先右后左）", sig: "AVLNode *RLRotate(AVLNode *A)", time: "O(1)",
      code: `AVLNode *RLRotate(AVLNode *A) {
    AVLNode *B = A->rchild, *C = B->lchild;
    B->lchild = C->rchild;         /* ① 先对 B 右旋 */
    C->rchild = B;
    A->rchild = C->lchild;         /* ② 再对 A 左旋 */
    C->lchild = A;
    return C;
}`,
      tips: "RL 与 LR 对称；判断口诀是「先看失衡方向，再看子树的偏向」。"
    },
    {
      name: "插入并保持平衡", sig: "AVLNode *InsertAVL(AVLNode *&T, KeyType k)", time: "O(log n)",
      code: `AVLNode *InsertAVL(AVLNode *&T, KeyType k) {
    if (T == NULL) {               /* 插入到空位置 */
        T = (AVLNode *)malloc(sizeof(AVLNode));
        T->key = k; T->bf = 0;
        T->lchild = T->rchild = NULL;
        return T;
    }
    if (k < T->key) {
        InsertAVL(T->lchild, k);
        if (Height(T->lchild) - Height(T->rchild) == 2) {
            if (k < T->lchild->key) T = LLRotate(T);   /* LL */
            else T = LRRotate(T);                      /* LR */
        }
    } else if (k > T->key) {
        InsertAVL(T->rchild, k);
        if (Height(T->rchild) - Height(T->lchild) == 2) {
            if (k > T->rchild->key) T = RRRotate(T);   /* RR */
            else T = RLRotate(T);                      /* RL */
        }
    }
    T->bf = Height(T->lchild) - Height(T->rchild);
    return T;
}`,
      tips: "失衡判断可以不用 bf 而直接比较高度差 2；真正决定 LL 还是 LR 的是「k 与失衡结点左孩子的大小关系」。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "hashtable", name: "散列表", cat: "查找",
  desc: "散列表通过散列函数把关键字映射到存储位置，理想情况查找 O(1)。冲突不可避免，解决方式分开放定址法（线性探测、二次探测）和链地址法。装填因子 α 越大冲突越多，ASL 越大。",
  type: `#define NULLKEY -32768
#define M 13                       /* 表长，一般取质数 */
typedef struct {
    int key;
    InfoType data;
} HashTable[M];                    /* 开放定址法的散列表 */`,
  tips: "线性探测的删除不能直接置空，要打删除标记，否则会截断后续探测链；装填因子定义为 已存记录数/表长。",
  ops: [
    {
      name: "除留余数法散列函数", sig: "int H(KeyType key)", time: "O(1)",
      code: `int H(KeyType key) {
    return key % M;               /* 除留余数法：p 取不超过表长的最大质数 */
}`,
      tips: "模数取质数能减少冲突；若表长不是质数，通常令 p 为小于表长的最大质数。"
    },
    {
      name: "线性探测插入", sig: "bool Insert(HashTable HT, KeyType k)", time: "O(1) 平均",
      code: `bool Insert(HashTable HT, KeyType k) {
    int i = H(k);
    if (HT[i].key == NULLKEY) {   /* 该位置空，直接放入 */
        HT[i].key = k; return true;
    }
    if (HT[i].key == k) return false;   /* 已存在 */
    int d = 1;
    while (d < M && HT[(i + d) % M].key != NULLKEY
           && HT[(i + d) % M].key != k)
        d++;                       /* 线性探测下一个位置 */
    if (d >= M) return false;      /* 表满 */
    if (HT[(i + d) % M].key == k) return false;
    HT[(i + d) % M].key = k;
    return true;
}`,
      tips: "探测位置是 (H(k)+d) % M，d 从 1 开始逐个加，直到遇到空位；全部探测完说明表满。"
    },
    {
      name: "开放定址查找", sig: "int Search(HashTable HT, KeyType k)", time: "O(1) 平均",
      code: `int Search(HashTable HT, KeyType k) {
    int i = H(k);
    int d = 0;
    while (d < M) {
        if (HT[(i + d) % M].key == k) return (i + d) % M;   /* 找到 */
        if (HT[(i + d) % M].key == NULLKEY) return -1;      /* 遇空位即失败 */
        d++;
    }
    return -1;
}`,
      tips: "查找时遇到空位置就可以断定失败，这是开放定址法的性质，也正是删除要打标记的原因。"
    },
    {
      name: "拉链法建表", sig: "void CreateHash(HashTable2 HT, RecType A[], int n)", time: "O(n)",
      code: `typedef struct node {
    KeyType key;
    struct node *next;
} HNode;                        /* 拉链法的结点 */

void CreateHash(HNode *HT[], RecType A[], int n) {
    for (int i = 0; i < M; i++) HT[i] = NULL;   /* 头指针全部置空 */
    for (int i = 0; i < n; i++) {
        int j = H(A[i].key);       /* 计算散列地址 */
        HNode *s = (HNode *)malloc(sizeof(HNode));
        s->key = A[i].key;
        s->next = HT[j];           /* 头插法挂到该桶 */
        HT[j] = s;
    }
}`,
      tips: "拉链法不会产生「堆积」，删除也方便；同义词链表用头插法建，查找时遍历该桶。"
    },
    {
      name: "求查找成功的 ASL", sig: "double ASL(HashTable HT)", time: "O(M)",
      code: `double ASL(HashTable HT) {
    int sum = 0, cnt = 0;
    for (int i = 0; i < M; i++) {
        if (HT[i].key == NULLKEY) continue;
        int d = 0;
        while (d < M) {            /* 计算该元素的比较次数 */
            int j = (i - d + M) % M;   /* 反向找到其初始散列地址 */
            if (HT[j].key == NULLKEY || H(HT[i].key) == j) { d++; break; }
            d++;
        }
        sum += d; cnt++;
    }
    return cnt ? (double)sum / cnt : 0;
}`,
      tips: "教材更常直接按「探测次数」手工统计 ASL；写代码时注意统计的是每个已存元素的探测长度。"
    }
  ]
});

/* 代码手册 · 分片6：排序 */
window.CODEBOOK = window.CODEBOOK || { groups: [] };

window.CODEBOOK.groups.push({
  id: "insort", name: "插入类排序", cat: "排序",
  desc: "插入类排序的思想是：把待排序元素逐个插入到前面已排好序的有序区中。直接插入在基本有序时接近 O(n)，希尔排序通过缩小增量让序列逐步变得基本有序，从而突破 O(n²)。",
  type: `typedef int KeyType;
typedef struct {
    KeyType key;
    InfoType data;
} RecType;                     /* 待排序记录 */`,
  tips: "直接插入是稳定排序、空间 O(1)；希尔排序不稳定，时间复杂度依赖增量序列，通常认为约 O(n^1.3)。",
  ops: [
    {
      name: "直接插入排序", sig: "void InsertSort(RecType R[], int n)", time: "O(n²)",
      code: `void InsertSort(RecType R[], int n) {
    int i, j;
    RecType tmp;
    for (i = 1; i < n; i++) {
        if (R[i].key < R[i - 1].key) {   /* 需要插入才移动 */
            tmp = R[i];                 /* 暂存待插入记录 */
            j = i - 1;
            while (j >= 0 && R[j].key > tmp.key) {
                R[j + 1] = R[j];        /* 记录后移 */
                j--;
            }
            R[j + 1] = tmp;             /* 插入到正确位置 */
        }
    }
}`,
      tips: "内层循环条件里 j>=0 必须写在前面（短路），否则 R[-1] 越界；R[j].key > tmp.key 用大于不是大于等于，保证稳定。"
    },
    {
      name: "折半插入排序", sig: "void BinInsertSort(RecType R[], int n)", time: "O(n²)",
      code: `void BinInsertSort(RecType R[], int n) {
    int i, j, low, high, mid;
    RecType tmp;
    for (i = 1; i < n; i++) {
        tmp = R[i];
        low = 0; high = i - 1;
        while (low <= high) {           /* 折半查找插入位置 */
            mid = (low + high) / 2;
            if (tmp.key < R[mid].key) high = mid - 1;
            else low = mid + 1;         /* 相等时插在后面，保持稳定 */
        }
        for (j = i - 1; j >= low; j--)
            R[j + 1] = R[j];            /* 统一后移 */
        R[low] = tmp;
    }
}`,
      tips: "折半只减少了比较次数（降到 O(n log n)），移动次数不变，所以总时间仍是 O(n²)。"
    },
    {
      name: "希尔排序", sig: "void ShellSort(RecType R[], int n)", time: "约 O(n^1.3)",
      code: `void ShellSort(RecType R[], int n) {
    int i, j, d;
    RecType tmp;
    d = n / 2;                          /* 初始增量 */
    while (d > 0) {
        for (i = d; i < n; i++) {       /* 对每个间隔为 d 的子序列做直接插入 */
            tmp = R[i];
            j = i - d;
            while (j >= 0 && tmp.key < R[j].key) {
                R[j + d] = R[j];
                j = j - d;
            }
            R[j + d] = tmp;
        }
        d = d / 2;                      /* 缩小增量 */
    }
}`,
      tips: "就是把直接插入排序中的 1 全部换成 d；增量序列必须最终为 1，否则不能保证有序。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "exsort", name: "交换类排序", cat: "排序",
  desc: "交换类排序通过比较相邻或指定元素并交换来逐步就位。冒泡排序每趟把最大元素冒到末尾，快速排序每趟以枢轴为界把序列划分成两半，是平均性能最好的内部排序。",
  type: `typedef int KeyType;
typedef struct {
    KeyType key;
    InfoType data;
} RecType;`,
  tips: "冒泡稳定、快排不稳定；快排平均 O(n log n)、最坏 O(n²)（基本有序时），空间 O(log n) 来自递归栈。",
  ops: [
    {
      name: "冒泡排序", sig: "void BubbleSort(RecType R[], int n)", time: "O(n²)",
      code: `void BubbleSort(RecType R[], int n) {
    int i, j;
    bool exchange;
    RecType tmp;
    for (i = 0; i < n - 1; i++) {
        exchange = false;
        for (j = n - 1; j > i; j--)     /* 从后往前，小的往前冒 */
            if (R[j].key < R[j - 1].key) {
                tmp = R[j]; R[j] = R[j - 1]; R[j - 1] = tmp;
                exchange = true;
            }
        if (!exchange) break;           /* 本趟无交换说明已有序 */
    }
}`,
      tips: "exchange 标志是冒泡的优化，一趟无交换即可提前结束，最好情况降到 O(n)。"
    },
    {
      name: "快速排序划分", sig: "int Partition(RecType R[], int s, int t)", time: "O(n)",
      code: `int Partition(RecType R[], int s, int t) {
    int i = s, j = t;
    RecType tmp = R[i];                 /* 以 R[s] 为枢轴 */
    while (i < j) {
        while (j > i && R[j].key >= tmp.key) j--;   /* 从右往左找小于枢轴的 */
        R[i] = R[j];
        while (i < j && R[i].key <= tmp.key) i++;   /* 从左往右找大于枢轴的 */
        R[j] = R[i];
    }
    R[i] = tmp;                         /* 枢轴归位 */
    return i;
}`,
      tips: "划分过程中枢轴先被「挖空」，所以是 R[i]=R[j] 覆盖而不是交换；两个内层循环都要判 i<j，否则越界。"
    },
    {
      name: "快速排序", sig: "void QuickSort(RecType R[], int s, int t)", time: "O(n log n) 平均",
      code: `void QuickSort(RecType R[], int s, int t) {
    int i;
    if (s < t) {                        /* 区间至少两个元素才排序 */
        i = Partition(R, s, t);         /* 划分，i 为枢轴位置 */
        QuickSort(R, s, i - 1);         /* 递归排左子区间 */
        QuickSort(R, i + 1, t);         /* 递归排右子区间 */
    }
}`,
      tips: "先划分再递归；递归出口是 s>=t。若序列已基本有序且总取首元素做枢轴，会退化成 O(n²)。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "selsort", name: "选择类排序", cat: "排序",
  desc: "选择类排序每趟从无序区选出最小（或最大）元素放到有序区末尾。简单选择排序比较次数固定为 n(n-1)/2；堆排序把选择过程用堆结构加速到 O(n log n)，适合找前 k 大等场景。",
  type: `typedef int KeyType;
typedef struct {
    KeyType key;
    InfoType data;
} RecType;`,
  tips: "简单选择不稳定（交换会打乱相等元素的相对次序）；堆排序也不稳定，但空间只需 O(1)。",
  ops: [
    {
      name: "简单选择排序", sig: "void SelectSort(RecType R[], int n)", time: "O(n²)",
      code: `void SelectSort(RecType R[], int n) {
    int i, j, k;
    RecType tmp;
    for (i = 0; i < n - 1; i++) {
        k = i;                          /* k 记录无序区最小元素下标 */
        for (j = i + 1; j < n; j++)
            if (R[j].key < R[k].key) k = j;
        if (k != i) {                   /* 最小元素不在本位才交换 */
            tmp = R[i]; R[i] = R[k]; R[k] = tmp;
        }
    }
}`,
      tips: "比较次数固定 n(n-1)/2，与初始序列无关；移动次数最少只需 n-1 次，这是它的优势。"
    },
    {
      name: "堆调整（筛选）", sig: "void sift(RecType R[], int low, int high)", time: "O(log n)",
      code: `void sift(RecType R[], int low, int high) {
    int i = low, j = 2 * i + 1;         /* j 是 i 的左孩子 */
    RecType tmp = R[i];
    while (j <= high) {
        if (j < high && R[j].key < R[j + 1].key) j++;   /* 选较大的孩子 */
        if (tmp.key < R[j].key) {       /* 孩子更大则上移 */
            R[i] = R[j];
            i = j; j = 2 * i + 1;
        } else break;
    }
    R[i] = tmp;                         /* 放到最终位置 */
}`,
      tips: "这是建大顶堆的筛选：与较大的孩子比较，孩子更大就上移，最后把 tmp 落到空位。j<high 判断防止越界。"
    },
    {
      name: "建初堆", sig: "void CreateHeap(RecType R[], int n)", time: "O(n)",
      code: `void CreateHeap(RecType R[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)   /* 从最后一个分支结点开始 */
        sift(R, i, n - 1);
}`,
      tips: "建堆从 n/2-1 号结点倒着筛，时间复杂度 O(n) 而不是 O(n log n)，这是常考结论。"
    },
    {
      name: "堆排序", sig: "void HeapSort(RecType R[], int n)", time: "O(n log n)",
      code: `void HeapSort(RecType R[], int n) {
    int i;
    RecType tmp;
    CreateHeap(R, n);                   /* 建大顶堆 */
    for (i = n - 1; i >= 1; i--) {
        tmp = R[0]; R[0] = R[i]; R[i] = tmp;   /* 堆顶（最大）换到末尾 */
        sift(R, 0, i - 1);                     /* 对剩余部分重新筛选 */
    }
}`,
      tips: "每趟把堆顶换到末尾后，有序区扩大、堆规模缩小 1，因此筛选范围是 0..i-1。"
    }
  ]
});

window.CODEBOOK.groups.push({
  id: "mgsort", name: "归并与基数排序", cat: "排序",
  desc: "二路归并排序把序列两两合并成有序段，再逐层合并，时间稳定 O(n log n)、是稳定排序，代价是需要 O(n) 辅助空间。基数排序按位分配收集，是非比较排序，适合位数固定的整数或字符串。",
  type: `typedef int KeyType;
typedef struct {
    KeyType key;
    InfoType data;
} RecType;`,
  tips: "归并排序是所有 O(n log n) 排序中唯一稳定且时间不随初始序列变化的；基数排序的时间是 O(d(n+r))，d 为位数、r 为基数。",
  ops: [
    {
      name: "合并两个有序段", sig: "void Merge(RecType R[], int low, int mid, int high)", time: "O(n)",
      code: `void Merge(RecType R[], int low, int mid, int high) {
    RecType *R1 = (RecType *)malloc((high - low + 1) * sizeof(RecType));
    int i = low, j = mid + 1, k = 0;
    while (i <= mid && j <= high) {     /* 两段逐元素比较 */
        if (R[i].key <= R[j].key) R1[k++] = R[i++];
        else R1[k++] = R[j++];
    }
    while (i <= mid) R1[k++] = R[i++];  /* 剩余部分直接复制 */
    while (j <= high) R1[k++] = R[j++];
    for (k = 0; k < high - low + 1; k++)
        R[low + k] = R1[k];             /* 写回原数组 */
    free(R1);
}`,
      tips: "判断用 R[i].key <= R[j].key（带等号）保证稳定；最后必须把剩余段整体复制，不能漏。"
    },
    {
      name: "一趟归并", sig: "void MergePass(RecType R[], int length, int n)", time: "O(n)",
      code: `void MergePass(RecType R[], int length, int n) {
    int i = 0;
    while (i + 2 * length - 1 < n) {    /* 左右两段都完整 */
        Merge(R, i, i + length - 1, i + 2 * length - 1);
        i = i + 2 * length;
    }
    if (i + length - 1 < n)             /* 只剩左段和不足长的右段 */
        Merge(R, i, i + length - 1, n - 1);
}`,
      tips: "边界处理是归并的难点：最后可能只剩一段，直接保留即可，不用合并。"
    },
    {
      name: "二路归并排序", sig: "void MergeSort(RecType R[], int n)", time: "O(n log n)",
      code: `void MergeSort(RecType R[], int n) {
    int length = 1;
    while (length < n) {
        MergePass(R, length, n);        /* 一趟归并，段长翻倍 */
        length = 2 * length;
    }
}`,
      tips: "自底向上，段长从 1 开始每趟翻倍，共 ⌈log₂n⌉ 趟，每趟 O(n)，总 O(n log n)。"
    },
    {
      name: "基数排序", sig: "void RadixSort(RecType R[], int n, int d, int r)", time: "O(d(n+r))",
      code: `void RadixSort(RecType R[], int n, int d, int r) {
    int cnt[10], pos[10];
    RecType *bucket = (RecType *)malloc(n * sizeof(RecType));
    int radix = 1;
    for (int k = 1; k <= d; k++) {      /* 从低位到高位，共 d 趟 */
        for (int i = 0; i < r; i++) cnt[i] = 0;
        for (int i = 0; i < n; i++)     /* 统计各桶元素个数 */
            cnt[(R[i].key / radix) % r]++;
        pos[0] = 0;
        for (int i = 1; i < r; i++)     /* 计算各桶的起始下标 */
            pos[i] = pos[i - 1] + cnt[i - 1];
        for (int i = 0; i < n; i++) {   /* 分配：按桶顺序依次放入 */
            int b = (R[i].key / radix) % r;
            bucket[pos[b]++] = R[i];
        }
        for (int i = 0; i < n; i++) R[i] = bucket[i];   /* 收集回原数组 */
        radix = radix * r;
    }
    free(bucket);
}`,
      tips: "基数排序必须「低位先排」（LSD），高位先排需要递归处理；分配时用 pos 数组保证同桶内原有次序，因此是稳定排序。"
    }
  ]
});

/* 代码手册 · 补充：串的 nextval、数组与广义表 */
window.CODEBOOK = window.CODEBOOK || { groups: [] };

/* 给「串」补一个求 nextval 的运算 */
(function () {
  var g = window.CODEBOOK.groups.find(function (x) { return x.id === "sqstring"; });
  if (!g) return;
  g.ops.push({
    name: "求 nextval 数组", sig: "void GetNextval(SqString t, int nextval[])", time: "O(m)",
    code: `void GetNextval(SqString t, int nextval[]) {
    int j = 0, k = -1;
    nextval[0] = -1;            /* 与 next 一样从 -1 开始 */
    while (j < t.length - 1) {
        if (k == -1 || t.data[j] == t.data[k]) {
            j++; k++;
            if (t.data[j] != t.data[k])
                nextval[j] = k;             /* 字符不同，退回位置就是 k */
            else
                nextval[j] = nextval[k];    /* 字符相同，直接继承 k 的 nextval */
        } else
            k = nextval[k];
    }
}`,
    tips: "nextval 是在 next 上再优化一层：如果「回退到的字符」和「当前字符」相同，回退就没有意义，直接继承 nextval[k]。手算时仍按 next 逐个求出，再比对字符。"
  });
})();

window.CODEBOOK.groups.push({
  id: "arraygl", name: "数组与广义表", cat: "线性结构",
  desc: "数组可以看作线性表的推广：二维数组本质上是「元素为一维数组的线性表」。多维数组按行优先或列优先映射到一维存储；对称矩阵、三角矩阵、稀疏矩阵用压缩存储省空间。广义表是线性表的另一种推广，元素既可以是原子也可以是子表。",
  type: `/* 对称矩阵：只存下三角（含主对角线），共 n*(n+1)/2 个元素 */
typedef struct {
    ElemType data[MaxSize];   /* 一维压缩数组 */
    int n;                    /* 矩阵阶数 */
} SymMatrix;

/* 稀疏矩阵的三元组顺序表 */
typedef struct {
    int i, j;                 /* 非零元的行、列下标 */
    ElemType v;               /* 非零元的值 */
} Triple;
typedef struct {
    Triple data[MaxSize];
    int mu, nu, tu;           /* 行数、列数、非零元个数 */
} TSMatrix;

/* 广义表结点：tag=0 为原子，tag=1 为子表 */
typedef struct GLNode {
    int tag;
    union {
        ElemType atom;                 /* 原子值 */
        struct GLNode *hp;             /* 子表的表头指针 */
    } val;
    struct GLNode *tp;                 /* 指向同一层的下一个元素 */
} GLNode;`,
  tips: "数组这一章几乎都是「套公式」：行优先下标 (i*n+j)，列优先下标 (j*m+i)，对称矩阵 k=i*(i+1)/2+j，上三角 k=i*(2n-i+1)/2+(j-i)。写错一半是因为题目的行、列下标从 0 还是从 1 开始，做题前先看清。",
  ops: [
    {
      name: "二维数组地址计算", sig: "int AddressRow(int base, int i, int j, int n, int L)", time: "O(1)",
      code: `/* 行优先：a[i][j] 的存储地址，n 为列数，L 为每个元素占的字节数 */
int AddressRow(int base, int i, int j, int n, int L) {
    return base + (i * n + j) * L;
}

/* 列优先：a[i][j] 的存储地址，m 为行数 */
int AddressCol(int base, int i, int j, int m, int L) {
    return base + (j * m + i) * L;
}`,
      tips: "行优先是「先排完一整行再排下一行」，所以 i 的系数是列数 n；列优先正好相反，i 的系数变成 1、j 的系数变成行数 m。"
    },
    {
      name: "对称矩阵压缩下标", sig: "int SymIndex(int i, int j)", time: "O(1)",
      code: `/* 对称矩阵只存下三角：a[i][j] 与 a[j][i] 共用一个存储单元 */
int SymIndex(int i, int j) {
    if (i < j) { int t = i; i = j; j = t; }   /* 上三角元素换成对称的下三角下标 */
    return i * (i + 1) / 2 + j;
}`,
      tips: "映射到「第 i 行之前共有 1+2+…+i = i*(i+1)/2 个元素」，再加上本行的 j。若题目下标从 1 开始，公式换成 (i-1)*i/2+(j-1)。"
    },
    {
      name: "上三角矩阵压缩下标", sig: "int UpperIndex(int i, int j, int n)", time: "O(1)",
      code: `/* n 阶上三角矩阵按行优先压缩，求 a[i][j]（i<=j）的一维下标 */
int UpperIndex(int i, int j, int n) {
    return i * (2 * n - i + 1) / 2 + (j - i);
}`,
      tips: "第 i 行之前有 n+(n-1)+…+(n-i+1) = i*(2n-i+1)/2 个元素，本行从第 i 列才开始存，所以要加 (j-i)。"
    },
    {
      name: "稀疏矩阵快速转置", sig: "void FastTranspose(TSMatrix A, TSMatrix *B)", time: "O(nu+tu)",
      code: `/* 三元组表存稀疏矩阵，按列号统计后直接放到转置矩阵的最终位置 */
void FastTranspose(TSMatrix A, TSMatrix *B) {
    int num[MaxSize] = {0}, pos[MaxSize] = {0};
    B->mu = A.nu; B->nu = A.mu; B->tu = A.tu;
    for (int t = 0; t < A.tu; t++) num[A.data[t].j]++;   /* 统计每一列的非零元个数 */
    for (int c = 1; c < A.nu; c++) pos[c] = pos[c - 1] + num[c - 1];
    for (int t = 0; t < A.tu; t++) {                     /* 一次扫描直接定位 */
        int c = A.data[t].j;
        B->data[pos[c]].i = A.data[t].j;
        B->data[pos[c]].j = A.data[t].i;
        B->data[pos[c]].v = A.data[t].v;
        pos[c]++;                                        /* 该列下一个位置 */
    }
}`,
      tips: "普通转置要反复扫描三元组表，是 O(nu*tu)；快速转置先统计列再定位，降到 O(nu+tu)。转置时 i、j 必须交换，值不变。"
    },
    {
      name: "广义表求长度", sig: "int GListLength(GLNode *L)", time: "O(n)",
      code: `/* 长度 = 最外层元素的个数（原子和子表都算一个元素） */
int GListLength(GLNode *L) {
    int len = 0;
    GLNode *p = L->val.hp;        /* 从左到右沿 tp 链数元素 */
    while (p != NULL) { len++; p = p->tp; }
    return len;
}`,
      tips: "长度只看最外层：LS=((a,b),c) 的长度是 2，不是 3。空表长度为 0。"
    },
    {
      name: "广义表求深度", sig: "int GListDepth(GLNode *L)", time: "O(n)",
      code: `/* 深度 = 括号的最大嵌套层数，原子深度为 0，空表深度为 1 */
int GListDepth(GLNode *L) {
    if (L == NULL) return 1;                   /* 空表 */
    int max = 0;
    for (GLNode *p = L->val.hp; p != NULL; p = p->tp) {
        int d = (p->tag == 0) ? 0 : GListDepth(p->val.hp);
        if (d > max) max = d;
    }
    return max + 1;
}`,
      tips: "深度和长度是最容易混的一对：LS=((a,b),c) 长度为 2、深度为 2；LS=(a,(b,(c))) 长度为 2、深度为 3。"
    },
    {
      name: "取表头与取表尾", sig: "GLNode *GetHead(GLNode *L) / GLNode *GetTail(GLNode *L)", time: "O(1)",
      code: `/* 取表头：返回第一个元素（可能是原子，也可能是子表） */
GLNode *GetHead(GLNode *L) {
    if (L == NULL || L->val.hp == NULL) return NULL;   /* 空表没有表头 */
    return L->val.hp;
}

/* 取表尾：返回去掉表头后其余元素构成的广义表（表尾一定是子表） */
GLNode *GetTail(GLNode *L) {
    if (L == NULL || L->val.hp == NULL) return NULL;   /* 空表没有表尾 */
    GLNode *p = L->val.hp->tp;
    if (p == NULL) {                     /* 只剩一个元素，表尾是空表 */
        GLNode *e = (GLNode *)malloc(sizeof(GLNode));
        e->tag = 1; e->val.hp = NULL; e->tp = NULL;
        return e;
    }
    return p;                            /* 剩余部分用 tp 链表示 */
}`,
      tips: "表尾一定是广义表（要加一层括号），表头不一定是。LS=(a,b,c) 的表头是 a，表尾是 (b,c)。"
    }
  ]
});

/* 代码手册 · 补充：树和森林 */
window.CODEBOOK.groups.push({
  id: "treeforest", name: "树和森林", cat: "树和二叉树",
  desc: "树的常用存储结构是双亲表示法和孩子兄弟表示法。孩子兄弟表示法把「第一个孩子」和「下一个兄弟」分别用左右指针相连，本质就是「左孩子右兄弟」的二叉链表，因此树与二叉树可以一一转换，森林的遍历也由此归结为二叉树的遍历。",
  type: `/* 孩子兄弟表示法（二叉链表）：左指针指第一个孩子，右指针指下一个兄弟 */
typedef struct CSNode {
    ElemType data;
    struct CSNode *firstchild;     /* 第一个孩子 */
    struct CSNode *nextsibling;    /* 右边的兄弟 */
} CSNode, *CSTree;

/* 双亲表示法：适合找双亲，找孩子要扫描整个数组 */
#define MaxSize 100
typedef struct {
    ElemType data;
    int parent;                    /* 双亲下标，根结点为 -1 */
} PTNode;
typedef struct {
    PTNode nodes[MaxSize];
    int n;                         /* 结点个数 */
} PTree;`,
  tips: "转换口诀「左孩子右兄弟」：树转二叉树后根结点没有右子树；森林转二叉树后根结点有右子树（第二棵树的根）。树的先根遍历序列 = 对应二叉树的先序序列，树的后根遍历序列 = 对应二叉树的中序序列，这是选择题的常客。",
  ops: [
    {
      name: "双亲表示法建树", sig: "void CreatePTree(PTree *T, ElemType data[], int parent[], int n)", time: "O(n)",
      code: `/* 由数据数组与双亲数组直接建树，parent[i] = -1 表示根 */
void CreatePTree(PTree *T, ElemType data[], int parent[], int n) {
    for (int i = 0; i < n; i++) {
        T->nodes[i].data = data[i];
        T->nodes[i].parent = parent[i];
    }
    T->n = n;
}`,
      tips: "双亲表示法的下标就是结点的「位置」，结点之间不靠指针联系，所以数组顺序一旦确定就不能随意调整。"
    },
    {
      name: "求结点的孩子", sig: "void PrintChildren(PTree T, int p)", time: "O(n)",
      code: `/* 双亲表示法找孩子：扫描整个数组，凡是 parent 等于 p 的都是孩子 */
void PrintChildren(PTree T, int p) {
    for (int i = 0; i < T.n; i++)
        if (T.nodes[i].parent == p)
            printf("%d ", T.nodes[i].data);
}`,
      tips: "双亲表示法找双亲是 O(1)，找孩子是 O(n)；孩子兄弟表示法正好相反：找孩子 O(1)，找双亲要遍历。"
    },
    {
      name: "求树的高度", sig: "int TreeHeight(PTree T)", time: "O(n*h)",
      code: `/* 对每个结点沿双亲链上溯到根，层数最大者即树高 */
int TreeHeight(PTree T) {
    int h = 0;
    for (int i = 0; i < T.n; i++) {
        int d = 1, p = T.nodes[i].parent;
        while (p != -1) { d++; p = T.nodes[p].parent; }   /* 见根即止 */
        if (d > h) h = d;
    }
    return h;
}`,
      tips: "上溯到根时用 -1 作为终止条件；如果根的双亲存的是 0 而不是 -1，要在循环前特判根。"
    },
    {
      name: "树的先根遍历", sig: "void PreOrder(CSTree T)", time: "O(n)",
      code: `/* 先根遍历：先访问根，再依次先根遍历每一棵子树 */
void PreOrder(CSTree T) {
    if (T == NULL) return;
    visit(T);                                  /* 访问根结点 */
    for (CSTree p = T->firstchild; p != NULL; p = p->nextsibling)
        PreOrder(p);                           /* 依次处理每个孩子 */
}`,
      tips: "孩子链是「第一个孩子 + 右兄弟」串起来的，循环沿 nextsibling 走，递归沿 firstchild 下探，顺序正好是从左到右。"
    },
    {
      name: "树的后根遍历", sig: "void PostOrder(CSTree T)", time: "O(n)",
      code: `/* 后根遍历：先依次后根遍历每棵子树，最后访问根 */
void PostOrder(CSTree T) {
    if (T == NULL) return;
    for (CSTree p = T->firstchild; p != NULL; p = p->nextsibling)
        PostOrder(p);
    visit(T);                                  /* 子树都访问完才访问根 */
}`,
      tips: "后根遍历也叫中根遍历，它对应二叉树的中序遍历；求逆波兰式（后缀表达式）就是后根遍历的一类应用。"
    },
    {
      name: "树的层次遍历", sig: "void LevelOrder(CSTree T)", time: "O(n)",
      code: `/* 层次遍历：用队列按层从左到右访问，孩子入队时沿兄弟链全部入队 */
void LevelOrder(CSTree T) {
    if (T == NULL) return;
    CSTree Q[MaxSize], p;
    int front = 0, rear = 0;
    Q[rear++] = T;
    while (front < rear) {
        p = Q[front++];
        visit(p);
        for (CSTree c = p->firstchild; c != NULL; c = c->nextsibling)
            Q[rear++] = c;                     /* 所有孩子依次入队 */
    }
}`,
      tips: "孩子兄弟表示法没有「孩子个数」字段，入队时必须自己沿 nextsibling 走一遍，不能只入第一个孩子。"
    },
    {
      name: "森林的遍历", sig: "void ForestPreOrder(CSTree F) / void ForestInOrder(CSTree F)", time: "O(n)",
      code: `/* 森林用孩子兄弟链表存储：各棵树的根由 nextsibling 串成一条链 */
void ForestPreOrder(CSTree F) {        /* 森林先序 = 各树先根遍历 */
    if (F == NULL) return;
    visit(F);
    ForestPreOrder(F->firstchild);     /* 第一棵树的子树 */
    ForestPreOrder(F->nextsibling);    /* 其余的树 */
}

void ForestInOrder(CSTree F) {         /* 森林中序 = 各树后根遍历 */
    if (F == NULL) return;
    ForestInOrder(F->firstchild);      /* 第一棵树的子树 */
    visit(F);                          /* 访问第一棵树的根 */
    ForestInOrder(F->nextsibling);     /* 其余的树 */
}`,
      tips: "森林的先序/中序遍历和对应二叉树的先序/中序遍历完全一致；森林没有「后序」这一说法，别被题目绕进去。"
    }
  ]
});

/* 代码手册 · 补充：B 树与 B+ 树 */
window.CODEBOOK.groups.push({
  id: "btreeidx", name: "B树与B+树", cat: "查找",
  desc: "B 树是多路平衡查找树，一个结点可存多个关键字、有多棵子树，树高很小，适合外存（磁盘）查找：一次结点访问就是一次磁盘 I/O。B+ 树把全部关键字放在叶子层并用指针串成链表，非叶子结点只作索引，更适合范围查找。",
  type: `#define M 5                    /* m 阶 B 树：每个结点最多 M 棵子树、M-1 个关键字 */
typedef struct BTNode {
    int key[M];                 /* 关键字，key[1..n] 有效，按升序排列 */
    struct BTNode *ptr[M];      /* ptr[0..n] 指向 n+1 棵子树 */
    int n;                      /* 当前关键字个数 */
    int leaf;                   /* 1 表示叶子结点 */
} BTNode;

/* B+ 树结点：非叶子结点只存索引，叶子结点之间用 next 串成链表 */
typedef struct BPNode {
    int key[M];
    struct BPNode *ptr[M];
    struct BPNode *next;        /* 叶子层的后继指针 */
    int n, leaf;
} BPNode;`,
  tips: "m 阶 B 树的三条硬性规定必须背下来：根结点至少 2 棵子树（除非它是叶子）；其他非叶结点至少 ⌈m/2⌉ 棵子树；所有叶子在同一层。B 树查找的复杂度是 O(log_m n)，关键在于结点内比较次数与磁盘 I/O 次数的区分。",
  ops: [
    {
      name: "B树查找", sig: "BTNode *BTSearch(BTNode *t, int k, int *pos)", time: "O(log_m n)",
      code: `/* 结点内顺序查找，未命中就沿指针下探一棵子树（每次下探对应一次磁盘读） */
BTNode *BTSearch(BTNode *t, int k, int *pos) {
    while (t != NULL) {
        int i = 1;
        while (i <= t->n && k > t->key[i]) i++;      /* 找第一个 key >= k 的位置 */
        if (i <= t->n && k == t->key[i]) { *pos = i; return t; }
        if (t->leaf) return NULL;                    /* 叶子还没找到，查找失败 */
        t = t->ptr[i - 1];                           /* 读入第 i 棵子树 */
    }
    return NULL;
}`,
      tips: "指针 ptr[i-1] 对应落在 key[i-1] 与 key[i] 之间的那棵子树，下标差一位是手写代码时最常见的错误。"
    },
    {
      name: "B树插入（含结点分裂）", sig: "void InsertBTree(BTNode *&t, int k)", time: "O(m log_m n)",
      code: `BTNode *NewNode() {
    BTNode *p = (BTNode *)malloc(sizeof(BTNode));
    p->n = 0; p->leaf = 1;
    for (int i = 0; i < M; i++) p->ptr[i] = NULL;
    return p;
}

/* 先沿查找路径下探到叶子，插入后自底向上分裂，必要时新建根 */
void InsertBTree(BTNode *&t, int k) {
    if (t == NULL) { t = NewNode(); t->key[1] = k; t->n = 1; return; }

    BTNode *path[64]; int pos[64], top = 0;   /* 记录查找路径，便于向上分裂 */
    BTNode *p = t;
    while (!p->leaf) {
        int i = 1;
        while (i <= p->n && k > p->key[i]) i++;
        path[top] = p; pos[top] = i; top++;
        p = p->ptr[i - 1];
    }
    int i = p->n;                             /* 叶子结点内有序插入 */
    while (i >= 1 && k < p->key[i]) { p->key[i + 1] = p->key[i]; i--; }
    p->key[i + 1] = k;
    p->n++;

    while (p->n > M - 1) {                    /* 关键字超限 → 分裂 */
        int mid = (M + 1) / 2;                /* 上移位置，5 阶时 mid = 3 */
        BTNode *q = NewNode();                /* q 为分裂出的右半结点 */
        q->leaf = p->leaf;
        q->n = p->n - mid;
        for (int j = 1; j <= q->n; j++) q->key[j] = p->key[mid + j];
        for (int j = 0; j <= q->n; j++) q->ptr[j] = p->ptr[mid + j];
        p->n = mid - 1;
        int up = p->key[mid];                 /* 中间关键字上移给双亲 */

        if (top == 0) {                       /* 分裂的是根：新建根，树高 +1 */
            BTNode *r = NewNode();
            r->leaf = 0; r->n = 1;
            r->key[1] = up;
            r->ptr[0] = p; r->ptr[1] = q;
            t = r;
            return;
        }
        BTNode *par = path[--top];            /* 双亲结点与插入位置 */
        int at = pos[top];
        for (int j = par->n; j >= at; j--) {
            par->key[j + 1] = par->key[j];
            par->ptr[j + 1] = par->ptr[j];
        }
        par->key[at] = up;
        par->ptr[at - 1] = p;
        par->ptr[at] = q;
        par->n++;
        p = par;                              /* 继续检查双亲是否也溢出 */
    }
}`,
      tips: "B 树的生长方向是「向上」：新关键字总是插到叶子，只有分裂时才有结点长到上一层，根分裂时树高才 +1，因此所有叶子始终在同一层。"
    },
    {
      name: "B+树查找", sig: "BPNode *BPSearch(BPNode *t, int k)", time: "O(log_m n)",
      code: `/* 非叶子结点只做索引，真正的关键字都在叶子层，命中必在叶子 */
BPNode *BPSearch(BPNode *t, int k) {
    while (t != NULL && !t->leaf) {
        int i = t->n;
        while (i >= 1 && k < t->key[i]) i--;   /* 找最后一个不大于 k 的分支 */
        t = t->ptr[i];
    }
    if (t == NULL) return NULL;
    for (int i = 1; i <= t->n; i++)
        if (t->key[i] == k) return t;
    return NULL;                               /* 叶子内没找到即失败 */
}`,
      tips: "B+ 树叶子链表支持顺序访问，做范围查询「从 k1 到 k2」时找到起点后沿 next 走即可；B 树做不到这一点，这是 B+ 树更适合数据库索引的原因。"
    }
  ]
});


