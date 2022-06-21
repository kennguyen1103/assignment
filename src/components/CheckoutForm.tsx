import { Fragment, useState } from "react";

import { Box, HStack, RadioGroup, Stack, Radio, Button, useNumberInput, Input, FormControl, FormErrorMessage, VStack, Text } from "@chakra-ui/react";
import { FormikConfig, useFormik } from "formik";
import { CUSTOMER, Order, OrderItem, SIZE } from "../type";
import * as Yup from "yup";
import { Checkout } from "../services/checkout";

const priceMapping = {
  small: 11.99,
  medium: 15.99,
  large: 21.99
}
const getPrice = (size: "small" | "medium" | "large") => {
  return priceMapping[size];
}

export const CheckoutForm = () => {
  const [order, setOrders] = useState({
    customer: "Facebook",
    orderItems: [] as OrderItem[],
  });
  const [calculateResult, setCalculatorResult] = useState<OrderItem[] | undefined>();

  const schema = Yup.object().shape({
    size: Yup.string().required(),
    quantity: Yup.number().required("Enter quantity").min(1),
  });
  const formikConig: FormikConfig<OrderItem> = {
    initialValues: {
      size: "small",
      quantity: 1,
      price: 11.99
    },

    validationSchema: schema,
    enableReinitialize: true,

    onSubmit: async (values: OrderItem) => {
      let newOrder = { ...order, orderItems: [...order.orderItems, {...values, price: getPrice(values.size)}] };
      setOrders(newOrder);
      const checkout = new Checkout(newOrder);
      newOrder.orderItems.forEach((x) => checkout.addToCart(x));
      const calculateResult = checkout.calculate();
      setCalculatorResult(calculateResult);
    },
  };

  const formik = useFormik(formikConig);
  const { values, errors, touched, isValid, handleChange, handleSubmit, setFieldValue } = formik;

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
    step: 1,
    defaultValue: values.quantity,
    value: values.quantity,
    min: 1,
    inputMode: "numeric",
    onChange: (value) => {
      setFieldValue("quantity", parseInt(value));
    },
    name: "quantity",
  });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  const isError = touched[`quantity`] || errors[`quantity`];

  console.log(calculateResult);
  return (
    <Fragment>
      <RadioGroup onChange={(value: string) => setOrders({ ...order, customer: value })} value={order.customer} name="customer">
        <HStack display="inline-flex">
          {Object.values(CUSTOMER).map((cus) => (
            <Radio key={cus} value={cus}>
              {cus}
            </Radio>
          ))}
        </HStack>
      </RadioGroup>
      <form onSubmit={handleSubmit} onChange={handleChange}>
        <Stack>
          <RadioGroup onChange={handleChange} value={values.size} name="size">
            <HStack display="inline-flex">
              {Object.values(SIZE).map((size) => (
                <Radio key={size} value={size}>
                  {size}
                </Radio>
              ))}
            </HStack>
          </RadioGroup>

          <Box>
            <VStack display="inline-flex">
              <FormControl>
                <HStack maxW="160px">
                  <Button {...inc}>+</Button>
                  <Input {...input} />
                  <Button {...dec}>-</Button>
                </HStack>

                {isError && <FormErrorMessage> {errors["quantity"]}</FormErrorMessage>}
              </FormControl>
            </VStack>
          </Box>
          <Box>
            <HStack display="inline-flex" spacing={3}>
              <Button colorScheme="blue" type="submit" disabled={!isValid}>
                ADD CART
              </Button>

              <Button colorScheme="blue" onClick={() => formik.resetForm()}>
                Reset
              </Button>
            </HStack>
          </Box>

          <Box>
            <VStack display="inline-flex" spacing={3}>
              {calculateResult?.map((rs, idx) => (
                <HStack key={idx}>
                  <Text>Size: {rs.size}</Text>
                  <Text>Quantity: {rs.quantity}</Text>
                  <Text>Total: {(rs.price * rs.quantity) || 0}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </Stack>
      </form>
    </Fragment>
  );
};
