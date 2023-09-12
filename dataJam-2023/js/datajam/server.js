import { WebSocketServer } from "ws";
import jsonlFile from "jsonl-db";
import { glob } from "glob";

const wss = new WebSocketServer({
  port: 8080,
});

let seriesCode = 2578928


wss.on("connection", async function connection(ws, req) {
  console.log(req.url);

  const jsfiles = await glob(`../../csgo/CCT-Online-Finals-1/${seriesCode}_events.jsonl`, {
    ignore: "node_modules/**",
  });

  console.log("Emitting", jsfiles[0]);
  const eventsFile = jsonlFile(jsfiles[0]);
  eventsFile.read((line) => ws.send(JSON.stringify(line)));
});


//Jerry - 156
//9048
//"clm78zmns0000isskew6cv1py"	2	59	30	38	5	0	0	15	726.3773130952382	0	12.87880730994151	0	0.1122807017543857	0.1032717136886978	3989	4185		0	0		"76561198026088156"
//"76561198026088156"	"Jerry"	30	38	5	11	15	726.3773130952382	3989	4185		0	0	"47336"	0	2	59	0	0.1016949152542374	12.31147988297015	0.09750232678403369	0	"5e7d90c5bcdc84aef385d6eef11e4dcbc571fb44f519f6a4e63f6153bbf2a574"
//"76561198031908632"	"Krad"	51	37	5	7	24	696.3479039682538	5808	4194		1	0	"47336"	0	2	59	0	0.1728813559322033	11.80250684691957	0.09015718523564975	0	"4421e2a42cbffeb2be7a92a6270bc124cfa37da840588c23b502514e14e612ef"

//"clm7vyw6s0000is4c48q5f2ir"	2	53	39	35	4	8	0	26	537.2257761904762	0	10.1363353998203	0	0.1471698113207547	0.08335593025861662	4300	3995		0	1		"76561198350362302" "R3salt"