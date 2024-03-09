```
Create an array of objects where the first string is the key and the other strings are an array of strings within that key. A newline represents a new object.
Data:
B201
Prevas
Releye
Sebratec
Sopra Steria

B202
Polisen
BOXbygg
Substorm

B204
Nordcloud
Nordlo
Orange Cyberdefense
Orange business services

B205
Epinova
Arbetsförmedlingen
Mestro
```

output:

Here's an array of objects based on the provided data:

```javascript
[
	{
		B201: ["Prevas", "Releye", "Sebratec", "Sopra Steria"],
	},
	{
		B202: ["Polisen", "BOXbygg", "Substorm"],
	},
	{
		B204: ["Nordcloud", "Nordlo", "Orange Cyberdefense", "Orange business services"],
	},
	{
		B205: ["Epinova", "Arbetsförmedlingen", "Mestro"],
	},
];
```

Each object in the array corresponds to a building (e.g. B201) and contains a key-value pair where the key is the building code and the value is an array of companies located in that building.
