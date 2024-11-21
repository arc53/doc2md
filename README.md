This project helps users to convert Documents (.pdf, .png, .jpg, .jpeg) into Markdown for you ease of ingestion into LLM workflows.

It uses a public LLM endpint (doc2md) [here](https://llm.arc53.com/docs#/)
This endpoint simply gives images or pdfs (converted to images) to visual model and asks it to conver it into markdown.

Here is a quick snippet using python to perform such task:
```python
# Client is your OpenAI compatible client
model = 'meta-llama/Llama-3.2-11B-Vision-Instruct'
prompt = "Convert the following image to just the markdown text, respond only with text and description of it if relevant."
messages = [
    {
        "role": "user",
        "content": [
                    {
            "type": "text",
            "text": prompt,
            },
            {
            "type": "image_url",
            "image_url": {
                "url":  f"{base64_image}"
            },
            },
        ]
    }
]
response = client.chat.completions.create(model=model,
    messages=messages,
    stream=False,
    max_tokens=int(max_new_tokens),
    **kwargs)
```
