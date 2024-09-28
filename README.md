# Go [TaxAssistant] FinTax

## Objective:
Develop an AI-based tax assistant that helps users with **filing tax returns** by:
1. **Asking questions** in natural language.
2. **Interpreting responses** and gathering information to complete tax forms.
3. Generating a **correctly completed XML file** for submission to the tax office.

## Key Responsibilities of the Assistant:
- Assist the user in **choosing the appropriate tax form** based on their situation.
- Help in **filling out the tax return** by asking relevant questions and interpreting responses.
- Ensure the **XML output** is compliant with the form’s XSD schema.
- Provide **clarifications** on tax-related questions.

### Initial Focus:
- Focus on **PCC-3 form** related to car purchases (civil law transaction tax).

## Key Features:
- **Polish language support** is mandatory; support for other languages like English or Ukrainian is optional.
- **Real-time interaction** with minimal latency.
- **Natural language processing** for recognizing user inputs.
- **Contextual understanding** to minimize the number of questions.
- **Simple and intuitive** language and interface.
- Ability to **correct and validate user inputs**.
- Perform **tax calculations** accurately.
- **Save and store conversations** for future reference.
- Ensure **data security** and **confidentiality**.

## Technical Requirements:
- Can be based on **cloud or on-premise** infrastructure.
- Accessible via a **web application** with a user-friendly interface.
- **Compliant with WCAG accessibility standards**.
- Must support all leading web browsers.
- Optionally, use **external cloud services** like Azure OpenAI for language models.
- Ensure **error handling** and **security** against common web attacks.
- **Cost-effective** and minimize the usage of tokens for communication with the AI model.

## Expected Deliverables:
1. A **working product** for verification.
2. A **2-5 slide presentation** of the solution.
3. A **demo video** (5-7 minutes).
4. A **user interface** for the AI assistant.
5. A **correct XML output** for the PCC-3 form, validated using the e-form service.

## Organizational Requirements:
Submit by **10:00 PM on the first day**:
- Solution concept.
- Architecture.
- Technologies used.

## Key Benefits:
- Simplified tax filing process.
- **24/7 availability** of the assistant.
- Potential for further expansion and support for additional forms.
- **Increased accessibility** for users with disabilities.

### Input Resources:
- PCC-3 Form **XSD schema** and **XSLT visualization**.
- **Knowledge base** and electronic form resources.

### Example Scenarios:
1. **Car Purchase**: Assist a user in completing the PCC-3 form after purchasing a used car.
2. **Private Loan**: Guide a user in filing the PCC-3 for a private loan agreement.
