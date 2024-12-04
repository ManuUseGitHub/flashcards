const mapPreset = (data: any) => {
  return {
    name: data.preset,
    preset: stripProperties(data, ['preset']),
  };
};

const stripProperties = (data: any, props: string[]) => {
  const copy = { ...data };
  props.forEach((p) => {
    delete copy[p];
  });
  return copy;
};

export { mapPreset, stripProperties };
