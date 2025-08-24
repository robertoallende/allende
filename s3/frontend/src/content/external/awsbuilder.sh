curl 'https://api.builder.aws.com/cs/content/user' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'amz-sdk-invocation-id: 2631b750-f12a-4255-989b-6e3a3403e1b6' \
  -H 'amz-sdk-request: attempt=1; max=3' \
  -H 'builder-session-token: dummy' \
  -H 'content-type: application/json' \
  -b 'awsccc=eyJlIjoxLCJwIjoxLCJmIjoxLCJhIjoxLCJpIjoiOTczOWE5MWQtNDVmZS00N2ZjLThmYmMtNDRhMDE2NDRhZDJkIiwidiI6IjEifQ==; AMCVS_7742037254C95E840A4C98A6%40AdobeOrg=1; AMCV_7742037254C95E840A4C98A6%40AdobeOrg=1585540135%7CMCIDTS%7C20325%7CMCMID%7C00117387863043431963410869466888408198%7CMCAAMLH-1756614591%7C8%7CMCAAMB-1756614591%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1756016991s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.4.0; cwr_u=fe788cc5-3862-4c6a-9d80-857bec02792c; awsd2c-token-c=eyJraWQiOiJlNTM3YTcxNy1iMjg4LTQ5YjMtODY4MS0zNDllMmJkZGE2MDAiLCJhbGciOiJFUzI1NiJ9.eyJ2aWQiOiJlY2NhYzk5NS1mOTc0LTMxOTQtOTJlNS0yNWQ2ZTg2Nzc4ZWMiLCJpc3MiOiJzX3AiLCJleHAiOjE3NTYwMTAzOTJ9.MEUCIQDMzt0BNbwbRffy4N6XoWfQQ8ry7L3Kdnl7QX6oEsCXqQIgMJSurHviN78AMOAVAq-PcYLmLjQ4be_fpXes-N_8gd4; aws-token-a-c=eyJraWQiOiJiOTgzZmQ4Yy02NTA1LTRjNDEtOTgyNy1hOTQwNTE1YWNhZTMiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJzX3AiLCJleHAiOjE3NTYwMTAzOTIsImFpZCI6IjkyY2I5ZmQyLTU3NTgtY2EzZC1mZDg1LTQyMzk2OTVlOTRkNyJ9.MEUCIQCzcErLthhxOWJvyvk-WlOK-7u8JXcbUugPnJF4wNcV4gIgAhpCLkHamwE11u4RUnQ4hgkgdcEEgyFgCYxWMaQdMeE; s_cc=true; s_sq=%5B%5BB%5D%5D; cwr_s=eyJzZXNzaW9uSWQiOiJiNzgwZDUxNy05YTgyLTQ1NGEtOTJjZS00MDYyMDdhMzM5MmEiLCJyZWNvcmQiOnRydWUsImV2ZW50Q291bnQiOjM0NiwicGFnZSI6eyJwYWdlSWQiOiIvY29tbXVuaXR5L0Byb2JlcnRvYWxsZW5kZSIsImludGVyYWN0aW9uIjowLCJyZWZlcnJlciI6IiIsInJlZmVycmVyRG9tYWluIjoiIiwic3RhcnQiOjE3NTYwMDk3OTE4Nzh9fQ==' \
  -H 'origin: https://builder.aws.com' \
  -H 'priority: u=1, i' \
  -H 'sec-ch-ua: "Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36' \
  -H 'x-amz-user-agent: aws-sdk-js/1.0.0 ua/2.1 os/macOS#10.15.7 lang/js md/browser#Chrome_139.0.0.0 api/bingocontent#1.0.0 m/N,E' \
  --data-raw '{"contentType":"ARTICLE","pageSize":5,"sort":{"article":{"sortOrder":"NEWEST"}},"userId":"e0a0031c-8900-4789-addf-e95154dc95a8"}'

