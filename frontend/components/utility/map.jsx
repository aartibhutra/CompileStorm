const map = new Map();

map.set("java", `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World!");\n  }\n}`)

map.set("c", `#include<stdio.h>\nvoid main(){printf("Hello World!");}`)

map.set("c++", `#include<iostream>\nusing namespace std;\nint main(){cout<<"Hello World!";\nreturn 0;}`)

map.set("python", `print("Hello World!");`)

export default map;  