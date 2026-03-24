import protobuf from 'protobufjs'

const proto = `
syntax = "proto3";
package Agora.SpeechToText;

message Word {
  string text = 1;
  bool is_final = 4;
}

message Translation {
  bool is_final = 1;
  string lang = 2;
  repeated string texts = 3;
}

message Text {
  int64 uid = 4;
  int64 time = 6;
  repeated Word words = 10;
  int32 duration_ms = 12;
  string data_type = 13;
  repeated Translation trans = 14;
  string culture = 15;
  int64 text_ts = 16;
}
`

const root = protobuf.parse(proto).root
const TextMessage = root.lookupType('Agora.SpeechToText.Text')

export type SttMessage = {
  uid: number
  time: number
  words: { text: string; isFinal: boolean }[]
  durationMs: number
  dataType: string
  trans: { isFinal: boolean; lang: string; texts: string[] }[]
  culture: string
  textTs: number
}

export function decodeSttMessage(data: Uint8Array): SttMessage {
  return TextMessage.decode(data) as unknown as SttMessage
}
