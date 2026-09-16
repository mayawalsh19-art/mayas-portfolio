// CSS doll characters from Doll Cast design handoff
// Each doll renders at 200×420px natural size; parent should scale + clip as needed.

const BIBI_HTML = `
<div style="position:absolute;left:36px;bottom:300px;width:128px;height:132px;border-radius:56px 56px 40px 40px;background:#F0C86A"></div>
<div style="position:absolute;left:30px;bottom:180px;width:34px;height:150px;border-radius:18px;background:#F0C86A"></div>
<div style="position:absolute;right:30px;bottom:180px;width:34px;height:150px;border-radius:18px;background:#F0C86A"></div>
<div style="position:absolute;left:46px;bottom:0;width:108px;height:16px;border-radius:50%;background:rgba(229,56,127,.18)"></div>
<div style="position:absolute;left:62px;bottom:8px;width:30px;height:16px;border-radius:4px 4px 9px 9px;background:#E5387F"></div>
<div style="position:absolute;right:62px;bottom:8px;width:30px;height:16px;border-radius:4px 4px 9px 9px;background:#E5387F"></div>
<div style="position:absolute;left:68px;bottom:20px;width:24px;height:156px;border-radius:12px;background:linear-gradient(100deg,rgba(255,255,255,.45),rgba(255,255,255,0) 55%),#F6D5BE"></div>
<div style="position:absolute;right:68px;bottom:20px;width:24px;height:156px;border-radius:12px;background:linear-gradient(100deg,rgba(255,255,255,.45),rgba(255,255,255,0) 55%),#F6D5BE"></div>
<div style="position:absolute;left:58px;bottom:166px;width:84px;height:50px;border-radius:10px 10px 28px 28px;background:linear-gradient(105deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#E5387F"></div>
<div style="position:absolute;left:66px;bottom:206px;width:68px;height:70px;border-radius:22px 22px 12px 12px;background:linear-gradient(105deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#F7A8C4"></div>
<div style="position:absolute;left:66px;bottom:208px;width:68px;height:10px;background:#E8B54A"></div>
<div style="position:absolute;left:46px;bottom:212px;width:17px;height:74px;border-radius:9px;background:linear-gradient(100deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#F6D5BE;transform:rotate(5deg)"></div>
<div style="position:absolute;right:46px;bottom:212px;width:17px;height:74px;border-radius:9px;background:linear-gradient(100deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#F6D5BE;transform:rotate(-5deg)"></div>
<div style="position:absolute;left:92px;bottom:270px;width:16px;height:22px;border-radius:6px;background:#EFC7AB"></div>
<div style="position:absolute;left:58px;bottom:284px;width:84px;height:96px;border-radius:38px;background:linear-gradient(150deg,#FFE6D3 0%,#F6D5BE 52%)">
  <div style="position:absolute;left:12px;top:14px;width:22px;height:30px;border-radius:50%;background:rgba(255,255,255,.32);transform:rotate(-20deg)"></div>
  <div style="position:absolute;left:16px;top:34px;width:16px;height:3px;border-radius:2px;background:#8A5A3A;transform:rotate(-9deg)"></div>
  <div style="position:absolute;right:16px;top:34px;width:16px;height:3px;border-radius:2px;background:#8A5A3A;transform:rotate(9deg)"></div>
  <div style="position:absolute;left:18px;top:43px;width:13px;height:15px;border-radius:7px;background:#3A6EA8"></div>
  <div style="position:absolute;right:18px;top:43px;width:13px;height:15px;border-radius:7px;background:#3A6EA8"></div>
  <div style="position:absolute;left:21px;top:46px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;right:21px;top:46px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;left:14px;top:64px;width:14px;height:7px;border-radius:50%;background:rgba(229,56,127,.22)"></div>
  <div style="position:absolute;right:14px;top:64px;width:14px;height:7px;border-radius:50%;background:rgba(229,56,127,.22)"></div>
  <div style="position:absolute;left:34px;top:68px;width:16px;height:10px;border-radius:50%;background:#D82F63"></div>
</div>
<div style="position:absolute;left:56px;bottom:352px;width:88px;height:36px;border-radius:44px 44px 12px 12px;background:#F0C86A"></div>
`

const KIP_HTML = `
<div style="position:absolute;left:46px;bottom:0;width:108px;height:16px;border-radius:50%;background:rgba(46,156,147,.20)"></div>
<div style="position:absolute;left:60px;bottom:8px;width:38px;height:16px;border-radius:6px 6px 9px 9px;background:#FFFDF9"></div>
<div style="position:absolute;right:60px;bottom:8px;width:38px;height:16px;border-radius:6px 6px 9px 9px;background:#FFFDF9"></div>
<div style="position:absolute;left:66px;bottom:20px;width:28px;height:158px;border-radius:14px;background:linear-gradient(100deg,rgba(255,255,255,.35),rgba(255,255,255,0) 55%),#2F5FA8"></div>
<div style="position:absolute;right:66px;bottom:20px;width:28px;height:158px;border-radius:14px;background:linear-gradient(100deg,rgba(255,255,255,.35),rgba(255,255,255,0) 55%),#2F5FA8"></div>
<div style="position:absolute;left:58px;bottom:170px;width:84px;height:46px;border-radius:10px 10px 20px 20px;background:#2F5FA8"></div>
<div style="position:absolute;left:58px;bottom:196px;width:84px;height:88px;border-radius:16px 16px 12px 12px;background:linear-gradient(105deg,rgba(255,255,255,.5),rgba(255,255,255,0) 55%),#F7F1E2;box-shadow:inset 0 0 0 2px #DCCFB8"></div>
<div style="position:absolute;left:96px;bottom:196px;width:6px;height:88px;background:#DCCFB8"></div>
<div style="position:absolute;left:42px;bottom:206px;width:19px;height:80px;border-radius:10px;background:linear-gradient(100deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#F7F1E2;box-shadow:inset 0 0 0 2px #DCCFB8;transform:rotate(5deg)"></div>
<div style="position:absolute;right:42px;bottom:206px;width:19px;height:80px;border-radius:10px;background:linear-gradient(100deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#F7F1E2;box-shadow:inset 0 0 0 2px #DCCFB8;transform:rotate(-5deg)"></div>
<div style="position:absolute;left:38px;bottom:196px;width:18px;height:18px;border-radius:9px;background:#F6D5BE"></div>
<div style="position:absolute;right:38px;bottom:196px;width:18px;height:18px;border-radius:9px;background:#F6D5BE"></div>
<div style="position:absolute;left:92px;bottom:274px;width:18px;height:22px;border-radius:6px;background:#EFC7AB"></div>
<div style="position:absolute;left:58px;bottom:288px;width:84px;height:96px;border-radius:36px;background:linear-gradient(150deg,#FFE6D3 0%,#F6D5BE 52%)">
  <div style="position:absolute;left:12px;top:14px;width:22px;height:30px;border-radius:50%;background:rgba(255,255,255,.3);transform:rotate(-20deg)"></div>
  <div style="position:absolute;left:16px;top:34px;width:17px;height:4px;border-radius:2px;background:#6B4A2A"></div>
  <div style="position:absolute;right:16px;top:34px;width:17px;height:4px;border-radius:2px;background:#6B4A2A"></div>
  <div style="position:absolute;left:18px;top:44px;width:13px;height:14px;border-radius:7px;background:#4E7B4A"></div>
  <div style="position:absolute;right:18px;top:44px;width:13px;height:14px;border-radius:7px;background:#4E7B4A"></div>
  <div style="position:absolute;left:21px;top:47px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;right:21px;top:47px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;left:34px;top:70px;width:16px;height:6px;border-radius:4px;background:#C4655C"></div>
</div>
<div style="position:absolute;left:54px;bottom:354px;width:92px;height:38px;border-radius:46px 46px 10px 20px;background:#C8912F"></div>
`

const ADA_HTML = `
<div style="position:absolute;left:40px;bottom:296px;width:120px;height:112px;border-radius:52px;background:#2A1E24"></div>
<div style="position:absolute;left:46px;bottom:0;width:108px;height:16px;border-radius:50%;background:rgba(122,79,192,.18)"></div>
<div style="position:absolute;left:62px;bottom:8px;width:30px;height:18px;border-radius:4px 4px 9px 9px;background:#2A1E24"></div>
<div style="position:absolute;right:62px;bottom:8px;width:30px;height:18px;border-radius:4px 4px 9px 9px;background:#2A1E24"></div>
<div style="position:absolute;left:68px;bottom:22px;width:24px;height:154px;border-radius:12px;background:linear-gradient(100deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#C88F63"></div>
<div style="position:absolute;right:68px;bottom:22px;width:24px;height:154px;border-radius:12px;background:linear-gradient(100deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#C88F63"></div>
<div style="position:absolute;left:56px;bottom:168px;width:88px;height:116px;border-radius:12px 12px 24px 24px;background:linear-gradient(105deg,rgba(255,255,255,.45),rgba(255,255,255,0) 55%),#7A4FC0"></div>
<div style="position:absolute;left:56px;bottom:236px;width:88px;height:8px;background:#E8B54A"></div>
<div style="position:absolute;left:44px;bottom:212px;width:17px;height:76px;border-radius:9px;background:linear-gradient(100deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#C88F63;transform:rotate(6deg)"></div>
<div style="position:absolute;right:44px;bottom:212px;width:17px;height:76px;border-radius:9px;background:linear-gradient(100deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#C88F63;transform:rotate(-6deg)"></div>
<div style="position:absolute;left:92px;bottom:272px;width:16px;height:22px;border-radius:6px;background:#BC8058"></div>
<div style="position:absolute;left:58px;bottom:286px;width:84px;height:96px;border-radius:38px;background:linear-gradient(150deg,#DDA179 0%,#C88F63 52%)">
  <div style="position:absolute;left:12px;top:14px;width:22px;height:30px;border-radius:50%;background:rgba(255,255,255,.24);transform:rotate(-20deg)"></div>
  <div style="position:absolute;left:16px;top:34px;width:16px;height:3px;border-radius:2px;background:#3A2318;transform:rotate(-8deg)"></div>
  <div style="position:absolute;right:16px;top:34px;width:16px;height:3px;border-radius:2px;background:#3A2318;transform:rotate(8deg)"></div>
  <div style="position:absolute;left:18px;top:43px;width:13px;height:15px;border-radius:7px;background:#4A3020"></div>
  <div style="position:absolute;right:18px;top:43px;width:13px;height:15px;border-radius:7px;background:#4A3020"></div>
  <div style="position:absolute;left:21px;top:46px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;right:21px;top:46px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;left:14px;top:64px;width:14px;height:7px;border-radius:50%;background:rgba(216,47,99,.18)"></div>
  <div style="position:absolute;right:14px;top:64px;width:14px;height:7px;border-radius:50%;background:rgba(216,47,99,.18)"></div>
  <div style="position:absolute;left:34px;top:68px;width:16px;height:10px;border-radius:50%;background:#B03A5B"></div>
</div>
<div style="position:absolute;left:50px;bottom:306px;width:16px;height:16px;border-radius:50%;background:#E8B54A"></div>
<div style="position:absolute;right:50px;bottom:306px;width:16px;height:16px;border-radius:50%;background:#E8B54A"></div>
`

const DAX_HTML = `
<div style="position:absolute;left:46px;bottom:0;width:108px;height:16px;border-radius:50%;background:rgba(232,137,31,.20)"></div>
<div style="position:absolute;left:60px;bottom:8px;width:38px;height:16px;border-radius:6px 6px 9px 9px;background:#2A1E24"></div>
<div style="position:absolute;right:60px;bottom:8px;width:38px;height:16px;border-radius:6px 6px 9px 9px;background:#2A1E24"></div>
<div style="position:absolute;left:66px;bottom:20px;width:28px;height:158px;border-radius:14px;background:linear-gradient(100deg,rgba(255,255,255,.35),rgba(255,255,255,0) 55%),#3F4A5C"></div>
<div style="position:absolute;right:66px;bottom:20px;width:28px;height:158px;border-radius:14px;background:linear-gradient(100deg,rgba(255,255,255,.35),rgba(255,255,255,0) 55%),#3F4A5C"></div>
<div style="position:absolute;left:58px;bottom:170px;width:84px;height:46px;border-radius:10px 10px 20px 20px;background:#3F4A5C"></div>
<div style="position:absolute;left:58px;bottom:196px;width:84px;height:88px;border-radius:16px 16px 12px 12px;background:linear-gradient(105deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#E8891F"></div>
<div style="position:absolute;left:44px;bottom:206px;width:19px;height:80px;border-radius:10px;background:linear-gradient(100deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#8E5A38;transform:rotate(7deg)"></div>
<div style="position:absolute;right:44px;bottom:206px;width:19px;height:80px;border-radius:10px;background:linear-gradient(100deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#8E5A38;transform:rotate(-7deg)"></div>
<div style="position:absolute;left:92px;bottom:274px;width:18px;height:22px;border-radius:6px;background:#7E4E2E"></div>
<div style="position:absolute;left:58px;bottom:288px;width:84px;height:96px;border-radius:36px;background:linear-gradient(150deg,#A26B44 0%,#8E5A38 52%)">
  <div style="position:absolute;left:12px;top:14px;width:22px;height:30px;border-radius:50%;background:rgba(255,255,255,.22);transform:rotate(-20deg)"></div>
  <div style="position:absolute;left:16px;top:34px;width:17px;height:4px;border-radius:2px;background:#2A1810"></div>
  <div style="position:absolute;right:16px;top:34px;width:17px;height:4px;border-radius:2px;background:#2A1810"></div>
  <div style="position:absolute;left:18px;top:44px;width:13px;height:14px;border-radius:7px;background:#2A1810"></div>
  <div style="position:absolute;right:18px;top:44px;width:13px;height:14px;border-radius:7px;background:#2A1810"></div>
  <div style="position:absolute;left:21px;top:47px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;right:21px;top:47px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;left:34px;top:70px;width:16px;height:6px;border-radius:4px;background:#7A3B33"></div>
</div>
<div style="position:absolute;left:54px;bottom:356px;width:92px;height:36px;border-radius:46px 46px 12px 12px;background:#2A1810"></div>
`

const SUKI_HTML = `
<div style="position:absolute;left:52px;bottom:342px;width:96px;height:60px;border-radius:48px 48px 16px 16px;background:#F26BA8"></div>
<div style="position:absolute;left:78px;bottom:380px;width:44px;height:40px;border-radius:22px 22px 10px 10px;background:#F26BA8"></div>
<div style="position:absolute;left:118px;bottom:250px;width:26px;height:118px;border-radius:14px;background:#F26BA8;transform:rotate(8deg)"></div>
<div style="position:absolute;left:46px;bottom:0;width:108px;height:16px;border-radius:50%;background:rgba(46,134,184,.18)"></div>
<div style="position:absolute;left:62px;bottom:8px;width:30px;height:16px;border-radius:4px 4px 9px 9px;background:#FFFDF9"></div>
<div style="position:absolute;right:62px;bottom:8px;width:30px;height:16px;border-radius:4px 4px 9px 9px;background:#FFFDF9"></div>
<div style="position:absolute;left:68px;bottom:20px;width:24px;height:156px;border-radius:12px;background:linear-gradient(100deg,rgba(255,255,255,.45),rgba(255,255,255,0) 55%),#F6D5BE"></div>
<div style="position:absolute;right:68px;bottom:20px;width:24px;height:156px;border-radius:12px;background:linear-gradient(100deg,rgba(255,255,255,.45),rgba(255,255,255,0) 55%),#F6D5BE"></div>
<div style="position:absolute;left:62px;bottom:168px;width:76px;height:44px;border-radius:10px 10px 16px 16px;background:linear-gradient(105deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#2E86B8"></div>
<div style="position:absolute;left:66px;bottom:206px;width:68px;height:72px;border-radius:20px 20px 12px 12px;background:linear-gradient(105deg,rgba(255,255,255,.45),rgba(255,255,255,0) 55%),#FFFDF9"></div>
<div style="position:absolute;left:46px;bottom:212px;width:17px;height:74px;border-radius:9px;background:linear-gradient(100deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#F6D5BE;transform:rotate(5deg)"></div>
<div style="position:absolute;right:46px;bottom:212px;width:17px;height:74px;border-radius:9px;background:linear-gradient(100deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#F6D5BE;transform:rotate(-5deg)"></div>
<div style="position:absolute;left:92px;bottom:270px;width:16px;height:22px;border-radius:6px;background:#EFC7AB"></div>
<div style="position:absolute;left:58px;bottom:284px;width:84px;height:96px;border-radius:38px;background:linear-gradient(150deg,#FFE6D3 0%,#F6D5BE 52%)">
  <div style="position:absolute;left:12px;top:14px;width:22px;height:30px;border-radius:50%;background:rgba(255,255,255,.32);transform:rotate(-20deg)"></div>
  <div style="position:absolute;left:16px;top:33px;width:16px;height:3px;border-radius:2px;background:#B4557F;transform:rotate(-11deg)"></div>
  <div style="position:absolute;right:16px;top:33px;width:16px;height:3px;border-radius:2px;background:#B4557F;transform:rotate(11deg)"></div>
  <div style="position:absolute;left:18px;top:43px;width:13px;height:15px;border-radius:7px;background:#5A8A6A"></div>
  <div style="position:absolute;right:18px;top:43px;width:13px;height:15px;border-radius:7px;background:#5A8A6A"></div>
  <div style="position:absolute;left:21px;top:46px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;right:21px;top:46px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;left:14px;top:64px;width:14px;height:7px;border-radius:50%;background:rgba(216,47,99,.22)"></div>
  <div style="position:absolute;right:14px;top:64px;width:14px;height:7px;border-radius:50%;background:rgba(216,47,99,.22)"></div>
  <div style="position:absolute;left:34px;top:68px;width:16px;height:10px;border-radius:50%;background:#D82F63"></div>
</div>
`

const RELL_HTML = `
<div style="position:absolute;left:46px;bottom:0;width:108px;height:16px;border-radius:50%;background:rgba(192,138,30,.20)"></div>
<div style="position:absolute;left:60px;bottom:8px;width:38px;height:18px;border-radius:6px 6px 9px 9px;background:#6B4A2A"></div>
<div style="position:absolute;right:60px;bottom:8px;width:38px;height:18px;border-radius:6px 6px 9px 9px;background:#6B4A2A"></div>
<div style="position:absolute;left:66px;bottom:22px;width:28px;height:156px;border-radius:14px;background:linear-gradient(100deg,rgba(255,255,255,.35),rgba(255,255,255,0) 55%),#7A8A5C"></div>
<div style="position:absolute;right:66px;bottom:22px;width:28px;height:156px;border-radius:14px;background:linear-gradient(100deg,rgba(255,255,255,.35),rgba(255,255,255,0) 55%),#7A8A5C"></div>
<div style="position:absolute;left:58px;bottom:172px;width:84px;height:44px;border-radius:10px 10px 18px 18px;background:#7A8A5C"></div>
<div style="position:absolute;left:58px;bottom:196px;width:84px;height:88px;border-radius:16px 16px 12px 12px;background:linear-gradient(105deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#C0473A"></div>
<div style="position:absolute;left:58px;bottom:238px;width:84px;height:9px;background:#6B4A2A"></div>
<div style="position:absolute;left:44px;bottom:206px;width:19px;height:80px;border-radius:10px;background:linear-gradient(100deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#C0473A;transform:rotate(6deg)"></div>
<div style="position:absolute;right:44px;bottom:206px;width:19px;height:80px;border-radius:10px;background:linear-gradient(100deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%),#C0473A;transform:rotate(-6deg)"></div>
<div style="position:absolute;left:39px;bottom:192px;width:20px;height:20px;border-radius:10px;background:#F6D5BE"></div>
<div style="position:absolute;right:39px;bottom:192px;width:20px;height:20px;border-radius:10px;background:#F6D5BE"></div>
<div style="position:absolute;left:92px;bottom:274px;width:18px;height:22px;border-radius:6px;background:#EFC7AB"></div>
<div style="position:absolute;left:58px;bottom:288px;width:84px;height:96px;border-radius:36px;background:linear-gradient(150deg,#FFE6D3 0%,#F6D5BE 52%)">
  <div style="position:absolute;left:12px;top:14px;width:22px;height:30px;border-radius:50%;background:rgba(255,255,255,.3);transform:rotate(-20deg)"></div>
  <div style="position:absolute;left:16px;top:34px;width:17px;height:4px;border-radius:2px;background:#8A5A3A;transform:rotate(4deg)"></div>
  <div style="position:absolute;right:16px;top:34px;width:17px;height:4px;border-radius:2px;background:#8A5A3A;transform:rotate(-4deg)"></div>
  <div style="position:absolute;left:18px;top:44px;width:13px;height:14px;border-radius:7px;background:#3A6EA8"></div>
  <div style="position:absolute;right:18px;top:44px;width:13px;height:14px;border-radius:7px;background:#3A6EA8"></div>
  <div style="position:absolute;left:21px;top:47px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;right:21px;top:47px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;left:34px;top:70px;width:16px;height:6px;border-radius:4px;background:#C4655C"></div>
</div>
<div style="position:absolute;left:54px;bottom:356px;width:92px;height:36px;border-radius:46px 46px 20px 8px;background:#E0A83A"></div>
`

const MILO_HTML = `
<div style="position:absolute;left:46px;bottom:0;width:108px;height:16px;border-radius:50%;background:rgba(42,122,108,.18)"></div>
<div style="position:absolute;left:60px;bottom:8px;width:38px;height:16px;border-radius:6px 6px 10px 10px;background:#E8E4D8"></div>
<div style="position:absolute;right:60px;bottom:8px;width:38px;height:16px;border-radius:6px 6px 10px 10px;background:#E8E4D8"></div>
<div style="position:absolute;left:66px;bottom:20px;width:28px;height:156px;border-radius:14px;background:linear-gradient(100deg,rgba(255,255,255,.22),rgba(255,255,255,0) 55%),#1E2A38"></div>
<div style="position:absolute;right:66px;bottom:20px;width:28px;height:156px;border-radius:14px;background:linear-gradient(100deg,rgba(255,255,255,.22),rgba(255,255,255,0) 55%),#1E2A38"></div>
<div style="position:absolute;left:58px;bottom:168px;width:84px;height:48px;border-radius:10px 10px 22px 22px;background:#1E2A38"></div>
<div style="position:absolute;left:58px;bottom:196px;width:84px;height:90px;border-radius:16px 16px 12px 12px;background:linear-gradient(105deg,rgba(255,255,255,.38),rgba(255,255,255,0) 55%),#2A7A6C"></div>
<div style="position:absolute;left:71px;bottom:200px;width:58px;height:22px;border-radius:5px 5px 9px 9px;background:rgba(0,0,0,.14)"></div>
<div style="position:absolute;left:40px;bottom:208px;width:20px;height:80px;border-radius:10px;background:linear-gradient(100deg,rgba(255,255,255,.34),rgba(255,255,255,0) 55%),#2A7A6C;transform:rotate(7deg)"></div>
<div style="position:absolute;right:40px;bottom:208px;width:20px;height:80px;border-radius:10px;background:linear-gradient(100deg,rgba(255,255,255,.34),rgba(255,255,255,0) 55%),#2A7A6C;transform:rotate(-7deg)"></div>
<div style="position:absolute;left:36px;bottom:196px;width:18px;height:18px;border-radius:9px;background:#7A4A28"></div>
<div style="position:absolute;right:36px;bottom:196px;width:18px;height:18px;border-radius:9px;background:#7A4A28"></div>
<div style="position:absolute;left:92px;bottom:278px;width:16px;height:22px;border-radius:6px;background:#683A18"></div>
<div style="position:absolute;left:58px;bottom:292px;width:84px;height:96px;border-radius:36px;background:linear-gradient(150deg,#9A5A34 0%,#7A3C1A 52%)">
  <div style="position:absolute;left:12px;top:14px;width:22px;height:30px;border-radius:50%;background:rgba(255,255,255,.18);transform:rotate(-20deg)"></div>
  <div style="position:absolute;left:16px;top:34px;width:17px;height:4px;border-radius:2px;background:#1A0C06"></div>
  <div style="position:absolute;right:16px;top:34px;width:17px;height:4px;border-radius:2px;background:#1A0C06"></div>
  <div style="position:absolute;left:18px;top:44px;width:13px;height:14px;border-radius:7px;background:#1A0C06"></div>
  <div style="position:absolute;right:18px;top:44px;width:13px;height:14px;border-radius:7px;background:#1A0C06"></div>
  <div style="position:absolute;left:21px;top:47px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;right:21px;top:47px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;left:34px;top:70px;width:16px;height:6px;border-radius:4px;background:#4A1A0A"></div>
</div>
<div style="position:absolute;left:38px;bottom:356px;width:124px;height:46px;border-radius:16px 16px 4px 4px;background:#1A1210"></div>
`

const PETRA_HTML = `
<div style="position:absolute;left:46px;bottom:0;width:108px;height:16px;border-radius:50%;background:rgba(100,40,160,.14)"></div>
<div style="position:absolute;left:58px;bottom:4px;width:40px;height:22px;border-radius:8px 8px 12px 12px;background:#1C1828"></div>
<div style="position:absolute;right:58px;bottom:4px;width:40px;height:22px;border-radius:8px 8px 12px 12px;background:#1C1828"></div>
<div style="position:absolute;left:68px;bottom:22px;width:24px;height:148px;border-radius:12px;background:linear-gradient(100deg,rgba(255,255,255,.18),rgba(255,255,255,0) 55%),#2A2840"></div>
<div style="position:absolute;right:68px;bottom:22px;width:24px;height:148px;border-radius:12px;background:linear-gradient(100deg,rgba(255,255,255,.18),rgba(255,255,255,0) 55%),#2A2840"></div>
<div style="position:absolute;left:60px;bottom:164px;width:80px;height:44px;border-radius:8px 8px 20px 20px;background:#2A2840"></div>
<div style="position:absolute;left:56px;bottom:196px;width:88px;height:92px;border-radius:16px 16px 10px 10px;background:linear-gradient(105deg,rgba(255,255,255,.22),rgba(255,255,255,0) 55%),#22202E"></div>
<div style="position:absolute;left:74px;bottom:196px;width:52px;height:16px;border-radius:4px 4px 8px 8px;background:#E8E2F0"></div>
<div style="position:absolute;left:72px;bottom:262px;width:14px;height:34px;border-radius:6px 2px 0px 8px;background:#EEE8E0;transform:rotate(-12deg)"></div>
<div style="position:absolute;right:72px;bottom:262px;width:14px;height:34px;border-radius:2px 6px 8px 0px;background:#EEE8E0;transform:rotate(12deg)"></div>
<div style="position:absolute;left:99px;bottom:196px;width:2px;height:54px;border-radius:1px;background:rgba(255,255,255,.26)"></div>
<div style="position:absolute;left:40px;bottom:208px;width:18px;height:78px;border-radius:9px;background:linear-gradient(100deg,rgba(255,255,255,.22),rgba(255,255,255,0) 55%),#22202E;transform:rotate(5deg)"></div>
<div style="position:absolute;right:40px;bottom:208px;width:18px;height:78px;border-radius:9px;background:linear-gradient(100deg,rgba(255,255,255,.22),rgba(255,255,255,0) 55%),#22202E;transform:rotate(-5deg)"></div>
<div style="position:absolute;left:37px;bottom:196px;width:18px;height:18px;border-radius:9px;background:#DDB894"></div>
<div style="position:absolute;right:37px;bottom:196px;width:18px;height:18px;border-radius:9px;background:#DDB894"></div>
<div style="position:absolute;left:92px;bottom:280px;width:16px;height:20px;border-radius:6px;background:#CCA882"></div>
<div style="position:absolute;left:58px;bottom:292px;width:84px;height:96px;border-radius:36px;background:linear-gradient(150deg,#F2D4B8 0%,#E6C49A 52%)">
  <div style="position:absolute;left:12px;top:14px;width:22px;height:30px;border-radius:50%;background:rgba(255,255,255,.38);transform:rotate(-20deg)"></div>
  <div style="position:absolute;left:15px;top:33px;width:18px;height:4px;border-radius:2px;background:#1E1428;transform:rotate(-6deg)"></div>
  <div style="position:absolute;right:15px;top:33px;width:18px;height:4px;border-radius:2px;background:#1E1428;transform:rotate(6deg)"></div>
  <div style="position:absolute;left:18px;top:43px;width:13px;height:14px;border-radius:7px;background:#1E1428"></div>
  <div style="position:absolute;right:18px;top:43px;width:13px;height:14px;border-radius:7px;background:#1E1428"></div>
  <div style="position:absolute;left:21px;top:46px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;right:21px;top:46px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;left:38px;top:70px;width:12px;height:5px;border-radius:3px;background:#A02050"></div>
</div>
<div style="position:absolute;left:44px;bottom:356px;width:112px;height:46px;border-radius:36px 36px 8px 22px;background:#1E1228"></div>
<div style="position:absolute;left:42px;bottom:312px;width:18px;height:48px;border-radius:12px 4px 4px 8px;background:#1E1228"></div>
`

const CASS_HTML = `
<div style="position:absolute;left:46px;bottom:0;width:108px;height:16px;border-radius:50%;background:rgba(30,58,92,.16)"></div>
<div style="position:absolute;left:64px;bottom:8px;width:32px;height:14px;border-radius:4px 4px 8px 8px;background:#1A2030"></div>
<div style="position:absolute;right:64px;bottom:8px;width:32px;height:14px;border-radius:4px 4px 8px 8px;background:#1A2030"></div>
<div style="position:absolute;left:66px;bottom:20px;width:28px;height:158px;border-radius:14px;background:linear-gradient(100deg,rgba(255,255,255,.5),rgba(255,255,255,0) 55%),#EDE6DA"></div>
<div style="position:absolute;right:66px;bottom:20px;width:28px;height:158px;border-radius:14px;background:linear-gradient(100deg,rgba(255,255,255,.5),rgba(255,255,255,0) 55%),#EDE6DA"></div>
<div style="position:absolute;left:58px;bottom:170px;width:84px;height:46px;border-radius:10px 10px 20px 20px;background:#EDE6DA"></div>
<div style="position:absolute;left:56px;bottom:196px;width:88px;height:94px;border-radius:16px 16px 12px 12px;background:linear-gradient(105deg,rgba(255,255,255,.32),rgba(255,255,255,0) 55%),#1E3A5C"></div>
<div style="position:absolute;left:74px;bottom:265px;width:52px;height:28px;border-radius:6px 6px 0 0;background:#F2EDE8"></div>
<div style="position:absolute;left:64px;bottom:268px;width:16px;height:30px;border-radius:8px 2px 0px 8px;background:#1E3A5C;transform:rotate(-10deg)"></div>
<div style="position:absolute;right:64px;bottom:268px;width:16px;height:30px;border-radius:2px 8px 8px 0px;background:#1E3A5C;transform:rotate(10deg)"></div>
<div style="position:absolute;left:40px;bottom:208px;width:18px;height:78px;border-radius:9px;background:linear-gradient(100deg,rgba(255,255,255,.3),rgba(255,255,255,0) 55%),#1E3A5C;transform:rotate(5deg)"></div>
<div style="position:absolute;right:40px;bottom:208px;width:18px;height:78px;border-radius:9px;background:linear-gradient(100deg,rgba(255,255,255,.3),rgba(255,255,255,0) 55%),#1E3A5C;transform:rotate(-5deg)"></div>
<div style="position:absolute;left:37px;bottom:196px;width:18px;height:18px;border-radius:9px;background:#C48060"></div>
<div style="position:absolute;right:37px;bottom:196px;width:18px;height:18px;border-radius:9px;background:#C48060"></div>
<div style="position:absolute;left:92px;bottom:278px;width:16px;height:20px;border-radius:6px;background:#B46E50"></div>
<div style="position:absolute;left:58px;bottom:290px;width:84px;height:96px;border-radius:36px;background:linear-gradient(150deg,#D8A07A 0%,#C07850 52%)">
  <div style="position:absolute;left:12px;top:14px;width:22px;height:30px;border-radius:50%;background:rgba(255,255,255,.26);transform:rotate(-20deg)"></div>
  <div style="position:absolute;left:16px;top:30px;width:16px;height:3px;border-radius:2px;background:#2A1810;transform:rotate(-7deg)"></div>
  <div style="position:absolute;right:16px;top:30px;width:16px;height:3px;border-radius:2px;background:#2A1810;transform:rotate(7deg)"></div>
  <div style="position:absolute;left:17px;top:41px;width:14px;height:16px;border-radius:7px;background:#2A1810"></div>
  <div style="position:absolute;right:17px;top:41px;width:14px;height:16px;border-radius:7px;background:#2A1810"></div>
  <div style="position:absolute;left:20px;top:44px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;right:20px;top:44px;width:5px;height:5px;border-radius:50%;background:#FFFFFF"></div>
  <div style="position:absolute;left:14px;top:64px;width:14px;height:7px;border-radius:50%;background:rgba(210,100,70,.20)"></div>
  <div style="position:absolute;right:14px;top:64px;width:14px;height:7px;border-radius:50%;background:rgba(210,100,70,.20)"></div>
  <div style="position:absolute;left:32px;top:68px;width:20px;height:9px;border-radius:50%;background:#A04030"></div>
  <div style="position:absolute;left:13px;top:37px;width:22px;height:22px;border-radius:9px;background:transparent;box-shadow:inset 0 0 0 2px #1E2840"></div>
  <div style="position:absolute;right:13px;top:37px;width:22px;height:22px;border-radius:9px;background:transparent;box-shadow:inset 0 0 0 2px #1E2840"></div>
  <div style="position:absolute;left:35px;top:47px;width:14px;height:2px;border-radius:1px;background:#1E2840"></div>
  <div style="position:absolute;left:8px;top:47px;width:6px;height:2px;border-radius:1px;background:#1E2840"></div>
  <div style="position:absolute;right:8px;top:47px;width:6px;height:2px;border-radius:1px;background:#1E2840"></div>
</div>
<div style="position:absolute;left:56px;bottom:360px;width:88px;height:66px;border-radius:44px;background:#2A1E18"></div>
<div style="position:absolute;left:44px;bottom:350px;width:28px;height:50px;border-radius:20px 8px 8px 16px;background:#2A1E18"></div>
<div style="position:absolute;right:44px;bottom:350px;width:28px;height:50px;border-radius:8px 20px 16px 8px;background:#2A1E18"></div>
`

const DOLL_HTML = { bibi: BIBI_HTML, kip: KIP_HTML, ada: ADA_HTML, dax: DAX_HTML, suki: SUKI_HTML, rell: RELL_HTML, milo: MILO_HTML, petra: PETRA_HTML, cass: CASS_HTML }

// Background gradients matching each doll's original card
export const DOLL_BG = {
  bibi:  'linear-gradient(180deg,#FFFDF9 0%,#FFEFF6 100%)',
  kip:   'linear-gradient(180deg,#FFFDF9 0%,#EAF8F5 100%)',
  ada:   'linear-gradient(180deg,#FFFDF9 0%,#F3ECFC 100%)',
  dax:   'linear-gradient(180deg,#FFFDF9 0%,#FFF3E2 100%)',
  suki:  'linear-gradient(180deg,#FFFDF9 0%,#E9F5FC 100%)',
  rell:  'linear-gradient(180deg,#FFFDF9 0%,#FCF3DF 100%)',
  milo:  'linear-gradient(180deg,#FFFDF9 0%,#E8F5F2 100%)',
  petra: 'linear-gradient(180deg,#FFFDF9 0%,#EFE8F5 100%)',
  cass:  'linear-gradient(180deg,#FFFDF9 0%,#E8EEF5 100%)',
}

export function Doll({ name }) {
  const html = DOLL_HTML[name] || ''
  return (
    <div
      style={{ position: 'relative', width: 200, height: 420, flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
