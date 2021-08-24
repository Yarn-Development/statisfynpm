# Statisfy
### Get statistics from all of your favourite social media sites, games and more!
## Example Usage
### CommonJS Usage
    const { npm } = require("statisfy");
    let test = async () => {
    const pkg = await npm("statisfy"); // your package here
    console.log(pkg);
    }
    test()
### ES Usage
    import { npm } from "statisfy";
    let test = async () => {
    const pkg = await npm("statisfy"); // your package here
    console.log(pkg);
    }
    test()