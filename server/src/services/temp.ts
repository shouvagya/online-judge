import { executeCpp } from "./executeCpp";

async function test() {
    const result = await executeCpp(
        `
        #include <iostream>
        using namespace std;

        int main() {
            int a,b;
            cin >> a >> b;
            cout << a+b;
            return 0;
        }
        `,
        "2 3"
    );

    console.log(result);
}

test();