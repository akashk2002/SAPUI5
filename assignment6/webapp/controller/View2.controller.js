<mvc:View controllerName="assignment6.controller.View2"
    xmlns:mvc="sap.ui.core.mvc"
    xmlns="sap.m"
    xmlns:form="sap.ui.layout.form"
    xmlns:core="sap.ui.core"
    xmlns:u="sap.ui.unified">
    
    <Page>
        <Wizard id="wizard">
            <WizardStep title="Items">
                <List id="itemList" items="{view>/items}">
                    <StandardListItem title="{view>name}" description="{view>price} {view>currency}" />
                </List>
            </WizardStep>
            <WizardStep title="Payment Method">
                <VBox>
                    <Text text="Select Payment Method:" />
                    <RadioButton groupName="paymentGroup" select="onPaymentMethodSelect" text="Credit Card" data-key="CreditCard"/>
                    <RadioButton groupName="paymentGroup" select="onPaymentMethodSelect" text="Cash on Delivery" data-key="CashOnDelivery"/>
                    <RadioButton groupName="paymentGroup" select="onPaymentMethodSelect" text="Bank Transfer" data-key="BankTransfer"/>
                </VBox>
            </WizardStep>
            <WizardStep title="Payment Details" id="paymentDetailsStep">
                <VBox id="paymentDetailsVBox">
                    <Text id="paymentDetailsText" text="Please enter your payment details." />
                    <VBox id="creditCardDetails" visible="false">
                        <Label text="Card Holder Name" required="true" />
                        <Input id="cardHolderName" placeholder="Card Holder Name" required="true" />
                        <Label text="Credit Card Number" required="true" />
                        <Input id="creditCardNumber" placeholder="Credit Card Number" required="true" />
                        <Label text="Expiry Date" required="true" />
                        <Input id="expiryDate" placeholder="Expiry Date" required="true" />
                        <Label text="Security Code" required="true" />
                        <Input id="securityCode" placeholder="Security Code" required="true" />
                    </VBox>
                    <VBox id="cashOnDeliveryDetails" visible="false">
                        <Label text="Billing Address" required="true" />
                        <Input id="billingAddress" placeholder="Enter your billing address" required="true" />
                    </VBox>
                    <VBox id="bankTransferDetails" visible="false">
                        <Label text="Bank Account Number" required="true" />
                        <Input id="bankAccountNumber" placeholder="Enter your bank account number" required="true" />
                        <Label text="Bank Name" required="true" />
                        <Input id="bankName" placeholder="Enter your bank name" required="true" />
                    </VBox>
                </VBox>
            </WizardStep>
            <WizardStep title="Invoice Address">
                <VBox>
                    <Label text="Street" />
                    <Input id="street" placeholder="Street" />
                    <Label text="City" />
                    <Input id="city" placeholder="City" />
                    <Label text="Postal Code" />
                    <Input id="postalCode" placeholder="Postal Code" />
                </VBox>
            </WizardStep>
            <WizardStep title="Delivery Type">
                <Select id="deliveryType">
                    <core:Item key="standard" text="Standard" />
                    <core:Item key="express" text="Express" />
                </Select>
            </WizardStep>
            <WizardStep title="Review Order">
                <VBox>
                    <Text text="Order Summary" />
                    <List id="orderSummaryList" items="{view>/items}">
                        <StandardListItem title="{view>name}" description="{view>price} {view>currency}" />
                    </List>
                    <Text text="Payment Method: {view>/selectedPaymentMethod}" />
                    <Text text="Card Holder Name: {view>/cardHolderName}" />
                    <Text text="Credit Card Number: {view>/creditCardNumber}" />
                    <Text text="Expiry Date: {view>/expiryDate}" />
                    <Text text="Security Code: {view>/securityCode}" />
                    <Text text="Billing Address: {view>/billingAddress}" />
                    <Text text="Bank Account Number: {view>/bankAccountNumber}" />
                    <Text text="Bank Name: {view>/bankName}" />
                    <Text text="Invoice Address: {view>/invoiceAddress/street}, {view>/invoiceAddress/city}, {view>/invoice Address/postalCode}" />
                </VBox>
            </WizardStep>
        </Wizard>
    </Page>
</mvc:View>