<div align="center">

![Kirishima Banner](https://cdn.discordapp.com/attachments/891939988088975372/931079377771450388/kirishima-ship-banner.png)

# @kirishima/deezer

# Instalation 
```
npm install @kirishima/deezer @kirishima/core
```

</div>

# Features
- Written in TypeScript
- Support ESM & CommonJS

# Example 
```ts
import { KirishimaDeezer } from "@kirishima/deezer";
import { Kirishima } from "@kirishima/core";

const kirishima = new Kirishima({
    plugins: [
        new KirishimaDeezer()
    ]
});
```