def repr_attrs(obj, attr_names):
    class_name = obj.__class__.__name__
    attributes = ['{}={}'.format(k, getattr(obj, k)) for k in attr_names]
    arguments = ', '.join(attributes)
    return '{}({})'.format(class_name, arguments)
