# yhl-utils


### Again

导入
```typescript
import { Again } from 'yhl-utils'
```

类型定义
```typescript
interface StopData {
    code: -1 | 200 | 401 | 400;
    message: string;
    data?: any;
}
/**
 * Again类，用于循环执行直到获得正确结果或达到循环次数
 */
declare class Again {
    private Fn;
    private count;
    private $count;
    private time;
    private open;
    private stopData;
    /**
     * 构造函数，初始化循环条件
     * @param {Function} Fn 循环函数，必须返回promise，并且resolve返回正确结果，reject返回错误结果
     * @param {Number} count 循环最大次数，-1 为无限循环
     * @param {Number} time 循环间隔时间
     */
    constructor(Fn: (index: number) => Promise<any>, count?: number, time?: number);
    /**
     * 重新开始执行循环
     */
    restart: () => void;
    /**
     * 停止执行循环
     * @param data 停止执行时的数据
     */
    stop: (data: StopData) => void;
    /**
     * 开始执行循环
     * @returns {Promise<StopData>} 执行结果的Promise
     */
    start: () => Promise<StopData>;
}
export default Again;

```

### Base64

导入
```typescript
import { Base64 } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 将字符串编码为 Base64 格式
 * @param {string} str 需要编码的字符串
 * @returns {string} 编码后的 Base64 字符串
 */
declare function btoa(str: string): string | undefined;
/**
 * 将 Base64 格式字符串解码为普通字符串
 * @param {string} str 需要解码的 Base64 字符串
 * @returns {string} 解码后的普通字符串
 */
declare function atob(str: string): string | undefined;
declare const Base64: {
    btoa: typeof btoa;
    atob: typeof atob;
};
export default Base64;

```

### IndexedDB

导入
```typescript
import { IndexedDB } from 'yhl-utils'
```

类型定义
```typescript
type StoreConfigType = {
    keyPath: string;
    keys: {
        [key: string]: {
            unique: boolean;
        };
    };
};
declare class IndexedDB {
    private DB?;
    private DBname;
    private version;
    static hasDB(): boolean;
    static initConfig(storeName: string, config: StoreConfigType): true | void;
    constructor(DBname: string, version?: number);
    private checkParams;
    private getDB;
    getTransaction(mode: IDBTransactionMode): Promise<false | IDBTransaction>;
    getStore(mode: IDBTransactionMode): Promise<false | IDBObjectStore>;
    delDB(): Promise<boolean>;
    clear(): Promise<boolean>;
    add(data: {
        [key: string]: any;
    }): Promise<boolean>;
    delete(keyPath: string | number): Promise<boolean>;
    put(data: {
        [key: string]: any;
    }): Promise<boolean>;
    get(keyPath: string | number): Promise<any>;
    queryKey(query: (key: string) => Promise<boolean> | boolean): Promise<string[] | boolean>;
    query(query: (key: string, val: any) => Promise<boolean> | boolean): Promise<any[] | boolean>;
}
export default IndexedDB;

```

### IntersectionObserver

导入
```typescript
import { IntersectionObserver } from 'yhl-utils'
```

类型定义
```typescript
/**
 * `OneIntersectionObserver`类用于观察元素与浏览器视口的交集情况
 * 当元素与视口发生交集时，会调用回调函数`setShow`来通知调用者
 * 支持一次性观察和重复观察两种模式
 */
export default class OneIntersectionObserver {
    private map;
    private IntersectionObserver;
    private threshold;
    /**
     * 构造函数，初始化观察的阈值
     * @param threshold 交集观察的阈值，默认为0.1
     */
    constructor(threshold?: number);
    /**
     * 初始化`IntersectionObserver`实例
     * 只有在尚未初始化的情况下才会创建新的`IntersectionObserver`实例
     */
    private init;
    /**
     * 开始观察指定元素
     * @param target 要观察的元素
     * @param setShow 当元素与视口交集时调用的回调函数，通知元素可见
     * @param once 是否只观察一次，默认为true
     * @returns 返回一个函数，该函数可用于停止观察
     */
    observe(target: Element, setShow: (show: boolean) => void, once?: boolean): () => void;
    /**
     * 停止观察指定元素
     * @param target 要停止观察的元素
     */
    unobserve(target: Element): void;
}

```

### JSONParse

导入
```typescript
import { JSONParse } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 解析 json字符串 （解决大整数和小数精度丢失问题）
 * @param {string} str json字符串
 * @returns {Promise<any>} json解出来的数据
 */
declare const JSONParse: {
    (str: string): any;
    init(): boolean;
} | {
    (str: string): any;
    init(): Promise<boolean>;
};
export default JSONParse;

```

### LimitConcurrentPromise

导入
```typescript
import { LimitConcurrentPromise } from 'yhl-utils'
```

类型定义
```typescript
export default class LimitConcurrentPromise {
    private list;
    private limit;
    private maxLimit;
    constructor(limit: number);
    private run;
    add(promiseFn: Function, options: any): Promise<unknown>;
}

```

### OneAsyncFunctionManage

导入
```typescript
import { OneAsyncFunctionManage } from 'yhl-utils'
```

类型定义
```typescript
export default class OneAsyncFunctionManage {
    private status;
    private list;
    /**
     * 私有方法run，用于执行列表中的第一个函数
     * 如果当前状态为正在执行函数，则不进行任何操作
     * 否则，从列表中取出第一个函数，将其标记为正在执行，然后调用该函数
     * 在函数执行完成后，无论结果如何，将状态标记为非执行状态，并再次调用run方法
     */
    private run;
    /**
     * 公共方法add，用于向函数列表中添加一个新的异步函数，并尝试执行列表中的函数
     * @param fn 要添加的异步函数，该函数返回一个Promise
     */
    add(fn: () => Promise<any>): void;
}

```

### PubSub

导入
```typescript
import { PubSub } from 'yhl-utils'
```

类型定义
```typescript
type Event = Exclude<any, null | undefined>;
type CallbackType = (...i: any) => void;
/**
 * 订阅事件
 * @param eventName 事件名称
 * @param callback 事件回调函数
 * @param once 是否仅触发一次，默认为false
 * @returns 取消订阅的函数
 */
export declare function subscribe(eventName: Event, callback: CallbackType, once?: boolean): (() => void) | undefined;
/**
 * 发布事件
 * @param eventName 事件名称
 * @param data 事件数据
 */
export declare function publish(eventName: Event, data: any): void;
/**
 * 取消订阅事件
 * @param eventName 事件名称
 * @param callback 需要取消的回调函数
 */
export declare function unsubscribe(eventName: Event, callback: CallbackType): void;
declare const _default: {
    subscribe: typeof subscribe;
    publish: typeof publish;
    unsubscribe: typeof unsubscribe;
};
export default _default;

```

### bubbleSort

导入
```typescript
import { bubbleSort } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 出口默认的冒泡排序函数
 * @param arr 待排序的数组，数组元素类型不限
 * @param getVal 可选的回调函数，用于获取每个元素的排序值，如果提供，则使用该函数比较元素
 * @returns 排序后的数组
 */
export default function bubbleSort(arr: any[], getVal?: (item: any) => number): any[];

```

### checkForm

导入
```typescript
import { checkForm } from 'yhl-utils'
```

类型定义
```typescript
type Form = AnyObj;
type RuleType = 'any' | 'phone' | 'email' | 'telephone' | Function;
interface Rule {
    type?: RuleType | RuleType[] | Function;
    message?: string;
    custom?: (key: string, data: any, form: Form) => string | void;
    middle?: (key: string, data: any, form: Form) => string | void;
    minLength?: number;
    maxLength?: number;
}
export interface rulesType {
    [key: string]: string | Rule | Rule[] | ((key: string, data: any, form: Form) => string | void);
}
/**
 * 表单验证函数
 * @param form 表单数据
 * @param rules 表单验证规则
 * @param autoToast 是否自动显示toast提示
 * @returns 返回包含状态码、错误提示和验证结果的对象
 */
declare function checkForm(form: Form, rules: rulesType, autoToast?: boolean): {
    code: 200 | 400;
    message?: string;
    inspect?: AnyObj;
};
declare namespace checkForm {
    var setCheckFormMessage: (message: (msg: string) => void) => void;
}
export default checkForm;

```

### chunk

导入
```typescript
import { chunk } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 将数组分割为指定大小的子数组
 *
 * @param arr 要处理的数组
 * @param size 每个子数组的大小
 * @returns 返回一个由分割后子数组组成的二维数组
 */
export default function chunk(arr: any[], size: number): any[][];

```

### classNames

导入
```typescript
import { classNames } from 'yhl-utils'
```

类型定义
```typescript
type ClassNameListType = string | ClassNameListType[] | {
    [key: string]: boolean;
};
/**
 * 函数classNames用于将输入的参数转换成一个合并后的类名字符串
 * 它可以处理字符串数组，对象类型的类名，以及嵌套的类名数组
 * @param {...ClassNameListType[]} list 一个或多个类名的字符串、数组或对象
 * @returns {string} 返回一个合并后的类名字符串
 */
export default function classNames(...list: ClassNameListType[]): string;
export {};

```

### csvDataHandle

导入
```typescript
import { csvDataHandle } from 'yhl-utils'
```

类型定义
```typescript
type Option = {
    keysObj?: {
        [key: string]: string;
    };
    middle?: (key: string, val: string) => any;
    filter?: (item: AnyObj) => boolean;
};
/**
 * 处理CSV数据并将其转换为对象数组
 *
 * @param csv 待处理的CSV字符串
 * @param option 可选配置对象，包含键映射、中间处理函数和过滤器
 * @returns 返回处理后的对象数组
 */
export default function csvDataHandle<T = AnyObj>(csv: string, option?: Option): T[];
export {};

```

### deepClone

导入
```typescript
import { deepClone } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 深拷贝函数
 * @param {any} obj 需要拷贝的对象
 * @returns {any} 拷贝后的新对象
 */
export default function deepClone(obj: any): any;

```

### devicePixelRatio

导入
```typescript
import { devicePixelRatio } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 获取设备的设备像素比（DPR）
 * 如果没有提供字符串参数，则返回DPR值
 * 如果提供了字符串参数，则将其中的{dpr}占位符替换为DPR值
 *
 * @param {string} [str] 可选参数，用于替换的字符串，包含占位符{dpr}
 * @returns {string | number} 返回DPR值或替换后的字符串
 */
declare function devicePixelRatio(): number;
declare function devicePixelRatio(str: string): string;
export default devicePixelRatio;

```

### encodeURIZnCh

导入
```typescript
import { encodeURIZnCh } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 将url中的中文转义为 url 编码
 * @param {string} url 转义前的url
 * @returns {string} 转义后的URL
 */
export default function encodeURIZnCh(url: string): string;

```

### formatAmount

导入
```typescript
import { formatAmount } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 计算金额
 * @param {string | number} money 金额
 * @returns {string} 处理后的金额
 */
export default function formatAmount(money: string | number, options?: {
    auto?: boolean;
    max?: number;
    maxStr?: string;
    decimalPlaces?: number;
    module?: boolean;
}): string | number | (string | number)[];

```

### formatNumber

导入
```typescript
import { formatNumber } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 格式化数字，保留指定位数的小数
 *
 * 该函数接受一个数值（可以是字符串或数字类型），并将其格式化为指定位数的小数
 * 如果传入的值不是有效的数字，则原样返回该值
 *
 * @param value 待格式化的数值，可以是字符串或数字类型
 * @param decimalPlaces 保留的小数位数，默认为2
 * @returns 格式化后的数值字符串，如果输入值无效则原样返回
 */
export default function formatNumber(value: string | number, decimalPlaces?: number): string | number;

```

### getFunBack

导入
```typescript
import { getFunBack } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 该函数用于处理各种类型的返回值，确保最终返回一个Promise对象。
 * 主要用于统一异步操作的返回值处理，提高代码的可维护性和可读性。
 *
 * @param data - 任意类型的输入数据，可以是函数、Promise或其他类型。
 * @returns 返回一个Promise对象，其解析或拒绝的结果取决于输入数据的类型。
 */
export default function getFunBack<T = any>(data: any): Promise<T>;

```

### getOffset

导入
```typescript
import { getOffset } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 获取DOM元素的偏移量
 * 此函数用于计算DOM元素的位置，包括上边距、左边距、宽度和高度
 * 它首先检查是否传递了有效的DOM对象，然后使用不同的方法获取元素的偏移量
 *
 * @param dom 要获取偏移量的DOM元素
 * @returns 返回一个包含元素上边距、左边距、宽度和高度的对象
 */
export default function getOffset(dom: HTMLElement): {
    w?: number | undefined;
    h?: number | undefined;
    t?: number | undefined;
    l?: number | undefined;
};

```

### getQuery

导入
```typescript
import { getQuery } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 获取URL和hash中的参数并转换为对象
 * @param {string} url 需要解析的URL，默认为当前页面URL
 * @returns {object} 解析后的参数对象
 */
export default function getQuery(url?: string): {
    [key: string]: string;
};

```

### getViewOffset

导入
```typescript
import { getViewOffset } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 获取视口宽高
 *
 * 该函数用于计算并返回当前视口的宽度和高度
 * 由于历史原因，body和documentElement在某些情况下会返回不同的值，
 * 因此需要进行判断以确保获取正确的视口尺寸
 *
 * @returns {Object} 返回一个包含视口宽度和高度的对象 {w, h}
 */
export default function getViewOffset(): {
    w: number;
    h: number;
};

```

### handleUrl

导入
```typescript
import { handleUrl } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 处理url中的路径问题 （添加前缀）
 *
 * 该函数主要用于处理url路径，如果给定的url不以协议头（如http://或https://）或双斜线（//）开头，
 * 则会自动为其添加双斜线（//）前缀，以形成一个相对路径。
 *
 * @param {string} url 待处理的url
 * @return {string} 处理后的url，如果输入为空或以协议头或双斜线开头，则原样返回，否则添加双斜线前缀
 */
export default function handleUrl(url: string): string;

```

### hasVal

导入
```typescript
import { hasVal } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 判断是否有值
 *
 * 此函数用于检查传入的数据是否有值，即是否为非空值或未定义
 * 它通过与一个预定义的特殊字符串进行比较来实现，如果传入的数据与这个特殊字符串不相等，
 * 则认为该数据是有值的这种方法可以有效地判断数据是否已被赋予一个实际的值，
 * 而不仅仅是简单的空值检查
 *
 * @param {any} data - 待检查的数据可以是任何类型
 * @returns {boolean} - 返回布尔值，如果data有值，则返回true；否则返回false
 */
export default function hasVal(data: any): boolean;

```

### isServer

导入
```typescript
import { isServer } from 'yhl-utils'
```

类型定义
```typescript
declare const _default: boolean;
export default _default;

```

### loadModules

导入
```typescript
import { loadModules } from 'yhl-utils'
```

类型定义
```typescript
type OptionType<P> = {
    cb?: (modules: P) => void;
    modules?: string | false;
};
/**
 * 加载模块
 * 本函数通过动态导入（Promise）的方式加载模块，提供了一个灵活的模块加载机制。
 * 它允许异步加载模块，并在模块加载完成后执行回调函数，提高了代码的模块化和可维护性。
 */
declare function loadModules<P = any>(modulesFn: () => Promise<any>, option?: OptionType<P>): Promise<P>;
declare function loadModules<P = any>(modulesFn: () => Promise<any>, option?: OptionType<P>['cb']): Promise<P>;
export default loadModules;

```

### loadScript

导入
```typescript
import { loadScript } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 动态加载JavaScript文件
 *
 * 此函数用于在运行时动态加载JavaScript文件到页面中它支持同步、异步和延迟加载方式
 * 在页面加载完成后，通常用于按需加载额外的JavaScript库或脚本
 *
 * @param {{id: string, src: string, load?: 'default' | 'defer' | 'async'}} param 配置项
 *   - id: 脚本标签的唯一标识符
 *   - src: 要加载的JavaScript文件的URL
 *   - load: (可选) 加载方式，可以是'default'、'defer'或'async'，分别表示同步、延迟和异步加载，默认为'async'
 * @returns {Promise<boolean>} 返回一个Promise，解析为true表示加载成功，false表示加载失败
 */
export default function loadScript({ id, src, load }: {
    src: string;
    load?: 'default' | 'defer' | 'async';
    id: string;
}): Promise<unknown>;

```

### mergeSort

导入
```typescript
import { mergeSort } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 归并排序
 * @param {any[]} arr 待排序的数组
 * @param getVal 获取排序字段的函数，可选
 * @returns {any[]} 排序后的数组
 */
export default function mergeSort(arr: any[], getVal?: (item: any) => number): any[];

```

### number2Chinese

导入
```typescript
import { number2Chinese } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 将数字转换为中文数字，支持负数
 * @param num 需要转换的数字
 * @returns 转换后的中文数字字符串
 */
export default function number2Chinese(num: number): string;

```

### number2ChineseWeek

导入
```typescript
import { number2ChineseWeek } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 将数字转换为对应的中文星期
 * 当输入的数字为7的倍数时，返回自定义的星期日字符串，否则返回对应的中文星期数
 *
 * @param week - 输入的数字，用于确定星期几
 * @param sundayStr - 星期日的自定义字符串，默认为'天'
 * @returns 返回中文星期或自定义的星期日字符串
 */
export default function number2ChineseWeek(week: number, sundayStr?: string): string;

```

### prefixInteger

导入
```typescript
import { prefixInteger } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 向字符串前面补位0
 * @param {String} str // 需要补位的数据
 * @param {Number} length // 补位长度
 * @returns {String}
 */
export default function prefixInteger(str: string | number, length: number): string;

```

### quickSort

导入
```typescript
import { quickSort } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 快排
 * @param {any[]} arr 待排序的数组
 * @param getVal 获取排序字段的函数，可选
 * @returns {any[]} 排序后的数组
 */
export default function quickSort(arr: any[], getVal?: (item: any) => number): any[];

```

### sessionShareStorage

导入
```typescript
import { sessionShareStorage } from 'yhl-utils'
```

类型定义
```typescript
declare const sessionShareStorage: Storage;
export default sessionShareStorage;

```

### structure

导入
```typescript
import { structure } from 'yhl-utils'
```

类型定义
```typescript
/**
 * 根据给定的键列表和数据对象，获取指定键的数据
 * 如果给定的是单个键字符串，将直接调用structureItem函数
 * 如果给定的是键的数组，将依次尝试每个键直到找到有效值或返回默认值
 * @param {string | string[]} keys - 要获取数据的键名或键名列表
 * @param {object} data - 包含数据的对象
 * @param {any} defaultVal - 如果无法获取数据项时的默认值
 * @returns {any} - 获取到的数据项或默认值
 */
export default function structure(keys: string | string[], data: object, defaultVal?: any): any;

```


## lazy 懒加载的模块