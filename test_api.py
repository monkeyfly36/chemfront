from openai import OpenAI

client = OpenAI(
    api_key='EMPTY',
    base_url="http://10.140.24.56:10001/v1"
)

completion = client.chat.completions.create(
  model="/mnt/hwfile/ai4chem/CKPT/ChemLLM-20B-Chat-DPO",
  messages=[
    {"role": "user", "content": "Hello!"}
  ]
)

print(completion.choices[0].message)


