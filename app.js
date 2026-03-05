const API = "https://ce.judge0.com/submissions/?base64_encoded=false&wait=true";
// 只支持 C++：用 GCC 9.2.0 (id=54)
const CPP_LANGUAGE_ID = 54;

const $code = document.getElementById("code");
const $stdin = document.getElementById("stdin");
const $out = document.getElementById("out");
const $run = document.getElementById("run");

function show(text) {
  $out.textContent = text;
}

$run.addEventListener("click", async () => {
  show("运行中...");
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language_id: CPP_LANGUAGE_ID,
        source_code: $code.value,
        stdin: $stdin.value
      })
    });

    const data = await res.json();

    // 按优先级显示：编译错误 > 运行错误 > 正常输出
    const status = data?.status?.description ? `状态：${data.status.description}\n` : "";
    const compile = data.compile_output ? `编译输出：\n${data.compile_output}\n` : "";
    const stderr = data.stderr ? `运行错误：\n${data.stderr}\n` : "";
    const stdout = data.stdout ? `标准输出：\n${data.stdout}\n` : "";

    show(status + compile + stderr + stdout || status || JSON.stringify(data, null, 2));
  } catch (e) {
    show("请求失败：\n" + (e?.message || String(e)));
  }
});
